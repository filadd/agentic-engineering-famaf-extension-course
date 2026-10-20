import { InlineError } from "../../ui/InlineError.tsx";

interface Props {
  text: string;
}

export const AuthNotice = ({ text }: Props) => (
  <InlineError className="mt-[18px] text-left">{text}</InlineError>
);
