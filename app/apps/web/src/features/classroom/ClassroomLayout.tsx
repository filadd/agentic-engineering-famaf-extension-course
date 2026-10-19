import type { ReactNode } from "react";

interface Props {
  header: ReactNode;
  notice?: ReactNode;
  stage: ReactNode;
  panel: ReactNode;
}

// The student's classroom page: the header, the slide on the left and the
// panel on the right, below the slide on a phone.
export const ClassroomLayout = ({ header, notice, stage, panel }: Props) => (
  <main className="flex h-dvh flex-col overflow-hidden">
    <div className="px-8 pt-[26px] pb-1.5 max-[600px]:px-3.5 max-[600px]:pt-3.5 max-[600px]:pb-1">
      {header}
    </div>
    {notice}
    <div className="flex min-h-0 flex-1 max-[600px]:flex-col">
      <div className="flex min-w-0 flex-1 flex-col px-8 pt-3.5 pb-[22px] max-[600px]:flex-none max-[600px]:px-3.5 max-[600px]:pt-2 max-[600px]:pb-2.5">
        {stage}
      </div>
      {panel}
    </div>
  </main>
);
