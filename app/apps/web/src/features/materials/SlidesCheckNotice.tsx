import { Icon } from "../../ui/Icon.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Spinner } from "../../ui/Spinner.tsx";
import { slidesNotices } from "./slides-notices.ts";
import type { SlidesCheckState } from "./useSlidesCheck.ts";

interface Props {
  state: SlidesCheckState;
}

export const SlidesCheckNotice = ({ state }: Props) => {
  if (state === "checking") {
    return (
      <p role="status" className="mt-3 flex items-center gap-2 text-sm text-muted">
        <Spinner size={14} />
        {slidesNotices.checking}
      </p>
    );
  }

  if (state === "ok") {
    return (
      <div
        role="status"
        className="mt-3 flex gap-2 rounded-[14px] bg-[#d7f1e3] px-3.5 py-3 text-sm text-[#26603f]"
      >
        <Icon name="check-circle" size={18} />
        <span>{slidesNotices.ok}</span>
      </div>
    );
  }

  return state === "invalid" ? (
    <InlineError className="mt-3">{slidesNotices.invalid}</InlineError>
  ) : null;
};
