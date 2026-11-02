import type { Poll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import {
  choicePoll,
  feedbackPoll,
  planning,
  scalePoll,
  voted,
  wordsPoll,
} from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { icons } from "../src/ui/icons.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { voteHandler } from "./helpers/vote-handlers.ts";

const choice = choicePoll(planning.id);
const scale = scalePoll(planning.id);
const words = wordsPoll(planning.id);

const openHome = async (poll: Poll) => {
  const { user } = await renderRoute("/");

  return { user, card: await screen.findByRole("article", { name: poll.prompt }) };
};

const withPolls = (...polls: ReadonlyArray<Poll>) =>
  server.use(getJson("/me", student), getJson("/sessions", [planning]), getJson("/polls", polls));

describe("voting on the highlighted card", () => {
  test("a choice poll takes one option and then shows the percentages and the count", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 4, choice: [1, 2, 1, 0] }),
    );

    withPolls(choice);
    server.use(vote.handler);

    const { user, card } = await openHome(choice);

    expect(within(card).getByText("Abierta")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "Algo" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ choice: 1 }]);
    expect(within(card).getByText("Votaste · 4 respuestas")).toBeTruthy();
    expect(card.querySelector("path")?.getAttribute("d")).toBe(icons["chart-bar"][0]);
    expect(
      within(results)
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["Nada25%", "✓ Algo50%", "La mitad25%", "Casi todo0%"]);
  });

  test("a scale poll offers 1 to 5 with the labels of the ends and then shows the distribution", async () => {
    const vote = voteHandler((myResponse) =>
      voted(scale, myResponse, { count: 3, scale: [0, 1, 0, 2, 0] }),
    );

    withPolls(scale);
    server.use(vote.handler);

    const { user, card } = await openHome(scale);

    expect(within(card).getByText("Nada cómodo")).toBeTruthy();
    expect(within(card).getByText("Muy cómodo")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "4" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });
    const bars = within(results).getAllByRole("listitem");

    expect(vote.votes).toEqual([{ scale: 4 }]);
    expect(bars.map((bar) => bar.textContent)).toEqual(["01", "12", "03", "24", "05"]);
    expect(bars[3]?.getAttribute("aria-current")).toBe("true");
  });

  test("a word cloud takes words separated by commas and then shows the cloud", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, {
        count: 2,
        words: [
          { word: "rápido", count: 2 },
          { word: "caos", count: 1 },
        ],
      }),
    );

    withPolls(words);
    server.use(vote.handler);

    const { user, card } = await openHome(words);

    await user.type(within(card).getByLabelText("Tus palabras"), "Rápido, caos,");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    const cloud = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ words: ["rápido", "caos"] }]);
    expect(within(cloud).getByText("rápido")).toBeTruthy();
    expect(within(card).getByText("Tus palabras: rápido, caos")).toBeTruthy();
  });

  test("changing the vote returns to the form with the previous vote marked and takes a new one", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 2, choice: [0, 0, 2, 0] }),
    );

    withPolls(voted(choice, { choice: 1 }, { count: 2, choice: [0, 2, 0, 0] }));
    server.use(vote.handler);

    const { user, card } = await openHome(choice);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));

    expect(within(card).getByRole("button", { name: "Algo" }).getAttribute("aria-pressed")).toBe(
      "true",
    );

    await user.click(within(card).getByRole("button", { name: "La mitad" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ choice: 2 }]);
    expect(within(results).getByText("✓ La mitad")).toBeTruthy();
  });

  test("cancelling the change shows the results with the previous vote", async () => {
    withPolls(voted(scale, { scale: 2 }, { count: 1, scale: [0, 1, 0, 0, 0] }));

    const { user, card } = await openHome(scale);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));

    expect(within(card).queryByRole("list", { name: "Resultados" })).toBeNull();

    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    const bars = within(within(card).getByRole("list", { name: "Resultados" })).getAllByRole(
      "listitem",
    );

    expect(bars[1]?.getAttribute("aria-current")).toBe("true");
  });

  test("cancelling in the word cloud closes the field", async () => {
    withPolls(
      voted(words, { words: ["contexto"] }, { count: 1, words: [{ word: "contexto", count: 1 }] }),
    );

    const { user, card } = await openHome(words);

    await user.click(within(card).getByRole("button", { name: "Sumar más palabras" }));

    expect(within(card).getByLabelText("Más palabras")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    expect(within(card).queryByLabelText("Más palabras")).toBeNull();
  });

  test("adding words sends the previous ones and the new ones", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, {
        count: 1,
        words: [
          { word: "contexto", count: 1 },
          { word: "loop", count: 1 },
        ],
      }),
    );

    withPolls(
      voted(words, { words: ["contexto"] }, { count: 1, words: [{ word: "contexto", count: 1 }] }),
    );
    server.use(vote.handler);

    const { user, card } = await openHome(words);

    await user.click(within(card).getByRole("button", { name: "Sumar más palabras" }));
    await user.type(within(card).getByLabelText("Más palabras"), "loop");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    await waitFor(() => expect(vote.votes).toEqual([{ words: ["contexto", "loop"] }]));
    expect(await within(card).findByText("Tus palabras: contexto, loop")).toBeTruthy();
  });

  test("a poll closed while voting shows a message, is asked for again and leaves the active ones", async () => {
    let pollRequests = 0;

    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
      http.get(url("/polls"), () => {
        pollRequests += 1;

        return HttpResponse.json(pollRequests === 1 ? [choice] : []);
      }),
      http.patch(url("/polls/:id"), () => apiError("PollNotActive")),
    );

    const { user, card } = await openHome(choice);

    await user.click(within(card).getByRole("button", { name: "Algo" }));

    expect((await screen.findByRole("status")).textContent).toBe(
      "El profe cerró esa encuesta antes de que respondieras.",
    );
    await waitFor(() => expect(screen.queryByRole("article", { name: choice.prompt })).toBeNull());
    expect(pollRequests).toBe(2);
  });
});

describe("answering a feedback on the highlighted card", () => {
  const feedback = feedbackPoll(planning.id);

  const answered = (myResponse: Poll["myResponse"]): Poll => ({ ...feedback, myResponse });

  test("the emoji 4 and a comment are sent, and the card thanks with the emoji and the text", async () => {
    const vote = voteHandler((myResponse) => answered(myResponse));

    withPolls(feedback);
    server.use(vote.handler);

    const { user, card } = await openHome(feedback);

    expect(card.querySelector("path")?.getAttribute("d")).toBe(icons["chat-messages"][0]);
    expect(within(card).getByText("Encuesta de feedback · se puede cambiar")).toBeTruthy();

    const faces = within(within(card).getByRole("radiogroup", { name: "Puntaje de la sesión" }));

    expect(faces.getAllByRole("radio").map((face) => face.textContent)).toEqual([
      "😞",
      "😕",
      "😐",
      "🙂",
      "😄",
    ]);
    expect(within(card).getByText("No me gustó")).toBeTruthy();
    expect(within(card).getByText("Más o menos")).toBeTruthy();
    expect(within(card).getByText("Me gustó")).toBeTruthy();
    expect(within(card).getByRole("button", { name: "Enviar feedback" })).toHaveProperty(
      "disabled",
      true,
    );

    await user.click(faces.getByRole("radio", { name: "4 de 5" }));
    await user.type(within(card).getByLabelText("Comentario"), "Me sirvió");
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect(await within(card).findByText("Gracias, ya nos llegó tu feedback.")).toBeTruthy();
    expect(vote.votes).toEqual([{ pick: 4, text: "Me sirvió" }]);
    expect(within(card).getByText("🙂")).toBeTruthy();
    expect(within(card).getByText("Me sirvió")).toBeTruthy();
    expect(within(card).getByRole("button", { name: "Cambiar mi respuesta" })).toBeTruthy();
  });

  test("sending without writing sends the pick alone and the thanks says there is no comment", async () => {
    const vote = voteHandler((myResponse) => answered(myResponse));

    withPolls(feedback);
    server.use(vote.handler);

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("radio", { name: "2 de 5" }));
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect(await within(card).findByText("Sin comentario.")).toBeTruthy();
    expect(vote.votes).toEqual([{ pick: 2 }]);
  });

  test("a comment of only spaces and line breaks sends the pick alone", async () => {
    const vote = voteHandler((myResponse) => answered(myResponse));

    withPolls(feedback);
    server.use(vote.handler);

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("radio", { name: "5 de 5" }));
    await user.type(within(card).getByLabelText("Comentario"), "   {Enter}{Enter}  ");
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect(await within(card).findByText("Sin comentario.")).toBeTruthy();
    expect(vote.votes).toEqual([{ pick: 5 }]);
  });

  test("while the answer waits the button says Enviando… and the emojis and the field are disabled", async () => {
    const held = heldResponse("patch", `/polls/${feedback.id}`);

    withPolls(feedback);
    server.use(held.handler);

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("radio", { name: "3 de 5" }));
    await user.type(within(card).getByLabelText("Comentario"), "Bien");
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect(await within(card).findByRole("button", { name: "Enviando…" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(within(card).getByLabelText("Comentario")).toHaveProperty("disabled", true);

    for (const face of within(card).getAllByRole("radio")) {
      expect(face).toHaveProperty("disabled", true);
    }

    held.release(HttpResponse.json(answered({ pick: 3, text: "Bien" })));

    expect(await within(card).findByText("Gracias, ya nos llegó tu feedback.")).toBeTruthy();
  });

  test("a failed send shows the error in the card, without a toast, and keeps the emoji and the text", async () => {
    withPolls(feedback);
    server.use(failingRoute("patch", `/polls/${feedback.id}`));

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("radio", { name: "4 de 5" }));
    await user.type(within(card).getByLabelText("Comentario"), "Casi");
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect((await within(card).findByRole("alert")).textContent).toBe(
      "No se pudo enviar tu feedback. Probá de nuevo.",
    );
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(within(card).getByRole("radio", { name: "4 de 5" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(within(card).getByLabelText<HTMLTextAreaElement>("Comentario").value).toBe("Casi");
  });

  test("changing the answer opens the form with what was saved and sends the new value", async () => {
    const vote = voteHandler((myResponse) => answered(myResponse));

    withPolls(answered({ pick: 4, text: "Bien" }));
    server.use(vote.handler);

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi respuesta" }));

    expect(within(card).getByRole("radio", { name: "4 de 5" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(within(card).getByLabelText<HTMLTextAreaElement>("Comentario").value).toBe("Bien");
    expect(within(card).getByRole("button", { name: "Cancelar" })).toBeTruthy();

    await user.click(within(card).getByRole("radio", { name: "5 de 5" }));
    await user.click(within(card).getByRole("button", { name: "Modificar feedback" }));

    expect(await within(card).findByText("Gracias, ya nos llegó tu feedback.")).toBeTruthy();
    expect(vote.votes).toEqual([{ pick: 5, text: "Bien" }]);
    expect(within(card).getByText("😄")).toBeTruthy();
  });

  test("cancelling the change goes back to the thanks with the saved answer", async () => {
    withPolls(answered({ pick: 2, text: "Regular" }));

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi respuesta" }));
    await user.click(within(card).getByRole("radio", { name: "5 de 5" }));
    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    expect(within(card).getByText("Gracias, ya nos llegó tu feedback.")).toBeTruthy();
    expect(within(card).getByText("😕")).toBeTruthy();
    expect(within(card).getByText("Regular")).toBeTruthy();
  });

  test("a feedback closed while answering shows the message and is asked for again", async () => {
    let pollRequests = 0;

    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
      http.get(url("/polls"), () => {
        pollRequests += 1;

        return HttpResponse.json(pollRequests === 1 ? [feedback] : []);
      }),
      http.patch(url("/polls/:id"), () => apiError("PollNotActive")),
    );

    const { user, card } = await openHome(feedback);

    await user.click(within(card).getByRole("radio", { name: "3 de 5" }));
    await user.click(within(card).getByRole("button", { name: "Enviar feedback" }));

    expect((await screen.findByRole("status")).textContent).toBe(
      "El profe cerró esa encuesta antes de que respondieras.",
    );
    await waitFor(() =>
      expect(screen.queryByRole("article", { name: feedback.prompt })).toBeNull(),
    );
    expect(pollRequests).toBe(2);
  });
});
