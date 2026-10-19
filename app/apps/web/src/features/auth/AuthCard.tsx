import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const AuthCard = ({ children }: Props) => (
  <main className="grid min-h-full place-items-center p-10 max-[600px]:px-5 max-[600px]:py-7">
    <div className="w-[min(440px,100%)] text-center">
      <div className="mx-auto mb-[18px] grid size-16 place-items-center rounded-[20px] bg-peach font-display text-[26px] font-bold text-coal">
        AV
      </div>
      {children}
    </div>
  </main>
);
