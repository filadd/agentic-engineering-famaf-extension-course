// Classroom client. The teacher's page captures input inside the embedded material and posts it;
// every page (teacher included, after a reload) replays the event log on its own copy.
const root = document.getElementById("aula");
const frame = document.getElementById("aula-frame");
const empty = document.getElementById("aula-empty");
const presence = document.getElementById("aula-presence");
const picker = document.getElementById("aula-picker");
const studentsPanel = document.getElementById("aula-students");
const studentsList = document.getElementById("aula-students-list");
const studentsToggle = document.getElementById("aula-students-toggle");

const showStudents = (show) => {
  studentsPanel.hidden = !show;

  if (studentsToggle != null) {
    studentsToggle.checked = show;
  }
};

const renderStudents = (students) => {
  studentsList.replaceChildren(
    ...students.map((student) => {
      const item = document.createElement("li");
      item.dataset.id = student.id;
      item.textContent = student.name;
      item.classList.toggle("raised", teacher && raisedIds.has(student.id));
      return item;
    }),
  );

  if (students.length === 0) {
    studentsList.innerHTML = `<li class="soon">Nadie todavía</li>`;
  }
};

const session = root.dataset.session;
const myId = root.dataset.student === "" ? null : Number(root.dataset.student);
const handButton = document.getElementById("aula-hand");
const pollCard = document.getElementById("aula-poll");
const pollDialog = document.getElementById("aula-poll-dialog");
const pollForm = document.getElementById("aula-poll-form");

const escapeHtml = (text) => {
  const span = document.createElement("span");
  span.textContent = text;
  return span.innerHTML;
};

const renderPoll = (poll) => {
  pollCard.hidden = poll == null;

  if (poll == null) {
    return;
  }

  const percent = (count) => (poll.total === 0 ? 0 : Math.round((count / poll.total) * 100));

  const option = (text, i) => {
    const mine = poll.myVote === i;

    if (poll.results != null) {
      return `<li class="poll-result ${mine ? "mine" : ""}">
        <div class="poll-bar" style="width: ${percent(poll.results[i])}%"></div>
        <span>${escapeHtml(text)}${mine ? " ✓" : ""}</span>
        <strong>${percent(poll.results[i])}%</strong>
      </li>`;
    }

    return `<li><button class="poll-option ${mine ? "mine" : ""}" data-option="${i}">${escapeHtml(text)}</button></li>`;
  };

  const status = poll.status === "open" ? (teacher ? "En curso" : poll.myVote == null ? "Elegí una opción" : "Votaste, podés cambiar tu voto") : "Resultados";

  pollCard.innerHTML = `
    <h2>📊 ${escapeHtml(poll.question)}</h2>
    <p class="poll-status">${status} · ${poll.total} ${poll.total === 1 ? "voto" : "votos"}</p>
    <ul>${poll.options.map(option).join("")}</ul>
    ${
      teacher
        ? poll.status === "open"
          ? `<button class="small" data-status="closed">Cerrar y mostrar resultados</button>`
          : `<button class="small ghost" data-status="done">Quitar encuesta</button>`
        : ""
    }`;
};
const handsBar = document.getElementById("aula-hands");

let raisedIds = new Set();

const renderHands = (hands) => {
  raisedIds = new Set(hands.map((h) => h.id));

  if (handButton != null) {
    const raised = raisedIds.has(myId);

    handButton.classList.toggle("raised", raised);
    handButton.textContent = raised ? "✋ Bajar la mano" : "✋ Levantar la mano";
  }

  if (handsBar != null) {
    handsBar.hidden = hands.length === 0;
    handsBar.replaceChildren(
      ...hands.map((hand) => {
        const chip = document.createElement("button");
        chip.className = "hand-chip";
        chip.title = "Bajar la mano";
        chip.textContent = `✋ ${hand.name} ✕`;
        chip.onclick = () => post(`hand/${hand.id}/lower`, {});
        return chip;
      }),
    );
  }

  studentsList.querySelectorAll("li[data-id]").forEach((item) => {
    item.classList.toggle("raised", teacher && raisedIds.has(Number(item.dataset.id)));
  });
};
const teacher = root.dataset.role === "teacher";

let loaded = false;
let queue = [];

const doc = () => frame.contentDocument;
const win = () => frame.contentWindow;

const keyEvent = (event) =>
  new KeyboardEvent("keydown", {
    key: event.key,
    code: event.code,
    keyCode: event.keyCode,
    which: event.keyCode,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
    bubbles: true,
    cancelable: true,
  });

const apply = (event) => {
  if (event.type === "key") {
    (doc().activeElement ?? doc().body).dispatchEvent(keyEvent(event));
  }

  if (event.type === "click") {
    const x = event.x * win().innerWidth;
    const y = event.y * win().innerHeight;
    const target = doc().elementFromPoint(x, y) ?? doc().body;

    target.dispatchEvent(new MouseEvent("click", { clientX: x, clientY: y, bubbles: true, cancelable: true, view: win() }));
  }

  if (event.type === "scroll") {
    const scroller = doc().scrollingElement;

    win().scrollTo(
      event.x * (scroller.scrollWidth - win().innerWidth),
      event.y * (scroller.scrollHeight - win().innerHeight),
    );
  }
};

let flushing = false;

// Spaced out so materials with step animations register each step.
const flush = async () => {
  if (!loaded || flushing) {
    return;
  }

  flushing = true;

  while (loaded && queue.length > 0) {
    apply(queue.shift());
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  flushing = false;
};

// Some materials (bundled decks) build their DOM asynchronously after "load". Wait until the
// document stops changing so replayed input lands on the real content, not on a loading screen.
const settled = (quietMs = 400, maxMs = 8000) =>
  new Promise((resolve) => {
    let timer = setTimeout(done, quietMs);
    const limit = setTimeout(done, maxMs);
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(done, quietMs);
    });

    function done() {
      clearTimeout(timer);
      clearTimeout(limit);
      observer.disconnect();
      resolve();
    }

    observer.observe(doc(), { childList: true, subtree: true, attributes: true });
  });

const post = (path, body) =>
  fetch(`/aula/${session}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const captureTeacherInput = () => {
  // Only trusted events come from the teacher; replayed ones are synthetic and must not echo back.
  // Lone modifiers and browser shortcuts (Ctrl+L, Cmd+R…) mean nothing to the material.
  const ignoredKey = (e) => ["Control", "Shift", "Alt", "Meta"].includes(e.key) || e.ctrlKey || e.metaKey;

  win().addEventListener("keydown", (e) => {
    if (e.isTrusted && !ignoredKey(e)) {
      post("events", { type: "key", key: e.key, code: e.code, keyCode: e.keyCode, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey });
    }
  }, true);

  win().addEventListener("click", (e) => {
    if (e.isTrusted) {
      post("events", { type: "click", x: e.clientX / win().innerWidth, y: e.clientY / win().innerHeight });
    }
  }, true);

  let scrollTimer = null;

  win().addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const scroller = doc().scrollingElement;
      const maxX = scroller.scrollWidth - win().innerWidth;
      const maxY = scroller.scrollHeight - win().innerHeight;

      post("events", { type: "scroll", x: maxX > 0 ? win().scrollX / maxX : 0, y: maxY > 0 ? win().scrollY / maxY : 0 });
    }, 120);
  });

  frame.focus();
};

const load = (materialId, events) => {
  loaded = false;
  queue = [...events];

  if (materialId == null) {
    frame.hidden = true;
    empty.hidden = false;
    frame.removeAttribute("src");
    return;
  }

  empty.hidden = true;
  frame.hidden = false;
  frame.src = `/materials/${materialId}`;

  if (picker != null) {
    picker.value = String(materialId);
  }
};

frame.addEventListener("load", async () => {
  if (frame.getAttribute("src") == null) {
    return;
  }

  const src = frame.getAttribute("src");

  await settled();

  // The teacher may have switched material while this one was settling.
  if (frame.getAttribute("src") !== src) {
    return;
  }

  loaded = true;

  if (teacher) {
    captureTeacherInput();
  }

  flush();
});

const stream = new EventSource(`/aula/${session}/stream`);

stream.onmessage = ({ data }) => {
  const message = JSON.parse(data);

  if (message.type === "sync") {
    load(message.materialId, message.events);
    showStudents(message.showStudents);
    renderHands(message.hands);
    renderPoll(message.poll);
  }

  if (message.type === "poll") {
    renderPoll(message.poll);
  }

  if (message.type === "hands") {
    renderHands(message.hands);
  }

  if (message.type === "students-panel") {
    showStudents(message.show);
  }

  if (message.type === "material") {
    load(message.materialId, []);
  }

  // The teacher already saw their own input happen natively.
  if (message.type === "event" && !teacher) {
    queue.push(message.event);
    flush();
  }

  if (message.type === "presence") {
    renderStudents(message.students);

    if (presence != null) {
      presence.textContent = message.students.length === 1 ? "1 estudiante mirando" : `${message.students.length} estudiantes mirando`;
    }
  }
};

pollCard.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button?.dataset.option != null) {
    post("polls/vote", { option: Number(button.dataset.option) });
  }

  if (button?.dataset.status != null) {
    post("polls/status", { status: button.dataset.status });
  }
});

document.getElementById("aula-poll-new")?.addEventListener("click", () => pollDialog.showModal());
document.getElementById("aula-poll-cancel")?.addEventListener("click", () => pollDialog.close());

pollForm?.addEventListener("submit", () => {
  const data = new FormData(pollForm);

  post("polls", { question: data.get("question"), options: String(data.get("options")).split("\n") });
  pollForm.reset();
});

handButton?.addEventListener("click", () => {
  post("hand", { raised: !raisedIds.has(myId) });
});

studentsToggle?.addEventListener("change", () => {
  post("students-panel", { show: studentsToggle.checked });
});

picker?.addEventListener("change", () => {
  post("material", { materialId: picker.value === "" ? null : Number(picker.value) });
});
