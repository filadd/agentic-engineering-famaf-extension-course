import { createElement, useEffect, useState } from "react";

import { SlidesFrame } from "../classroom/SlidesFrame.tsx";

export type SlidesCheckState = "idle" | "checking" | "ok" | "invalid";

export type SlidesCheckResult = "ok" | "invalid";

interface Options {
  okFor?: number;
}

interface Run {
  html: string;
  startedAt: number;
  resolve: (result: SlidesCheckResult) => void;
  result: SlidesCheckResult | null;
}

const minimum = 1000;

// The check of an HTML marked as slides: it loads in a hidden frame, which
// `frame` holds while it runs. The result shows a second after `start` at the
// earliest, so a fast check does not flash. With `okFor`, an ok goes back to
// idle after that many milliseconds.
export const useSlidesCheck = ({ okFor }: Options = {}) => {
  const [state, setState] = useState<SlidesCheckState>("idle");
  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => {
    if (run?.result == null) {
      return undefined;
    }

    const { result, resolve } = run;

    const publish = setTimeout(
      () => {
        setRun(null);
        setState(result);
        resolve(result);
      },
      Math.max(0, minimum - (Date.now() - run.startedAt)),
    );

    return () => clearTimeout(publish);
  }, [run]);

  useEffect(() => {
    if (state !== "ok" || okFor == null) {
      return undefined;
    }

    const back = setTimeout(() => setState("idle"), okFor);

    return () => clearTimeout(back);
  }, [state, okFor]);

  const settle = (result: SlidesCheckResult) =>
    setRun((current) => (current == null ? null : { ...current, result }));

  const start = (html: string) =>
    new Promise<SlidesCheckResult>((resolve) => {
      setRun({ html, startedAt: Date.now(), resolve, result: null });
      setState("checking");
    });

  const reset = () => {
    setRun(null);
    setState("idle");
  };

  const frame =
    run == null
      ? null
      : createElement(
          "div",
          { className: "hidden" },
          createElement(SlidesFrame, {
            key: run.startedAt,
            html: run.html,
            hidden: true,
            onManifest: () => settle("ok"),
            onInvalid: () => settle("invalid"),
          }),
        );

  return { state, start, reset, frame };
};
