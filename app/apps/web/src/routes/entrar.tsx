import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import { useEffect, useRef } from "react";

import { AuthCard } from "../features/auth/AuthCard.tsx";
import { InvalidLinkNotice } from "../features/auth/InvalidLinkNotice.tsx";
import { OpeningLink } from "../features/auth/OpeningLink.tsx";
import { useOpenSession } from "../features/me/useOpenSession.ts";

const OpenLinkSearch = Schema.Struct({ codigo: Schema.optional(Schema.String) });

const OpenLinkRoute = () => {
  const { codigo } = Route.useSearch();
  const navigate = useNavigate();

  const open = useOpenSession({
    onSuccess: (me) => {
      if (me.role === "teacher") {
        return navigate({ to: "/admin" });
      }

      return navigate({ to: me.name == null || me.avatar == null ? "/setup" : "/" });
    },
  });

  // The code is consumed on the first POST, so a second mount (StrictMode, or
  // a remount) must not send it again.
  const sent = useRef(false);

  useEffect(() => {
    if (codigo == null || sent.current) {
      return;
    }

    sent.current = true;
    open.mutate(codigo);
  }, [codigo, open]);

  const invalid = codigo == null || Predicate.isTagged(open.error, "InvalidLink");

  return <AuthCard>{invalid ? <InvalidLinkNotice /> : <OpeningLink />}</AuthCard>;
};

export const Route = createFileRoute("/entrar")({
  validateSearch: Schema.toStandardSchemaV1(OpenLinkSearch),
  component: OpenLinkRoute,
});
