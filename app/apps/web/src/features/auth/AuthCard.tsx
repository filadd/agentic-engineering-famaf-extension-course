import type { ReactNode } from "react";

import { CrowMark } from "../../ui/CrowMark.tsx";

interface Props {
  children: ReactNode;
}

export const AuthCard = ({ children }: Props) => (
  <main className="grid min-h-full place-items-center p-10 max-[600px]:px-5 max-[600px]:py-7">
    <div className="w-[min(440px,100%)] text-center">
      <div className="mb-[18px]">
        <CrowMark size="large" />
      </div>
      {children}
    </div>
  </main>
);
