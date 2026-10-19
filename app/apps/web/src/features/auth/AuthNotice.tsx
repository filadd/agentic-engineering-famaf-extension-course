interface Props {
  text: string;
}

export const AuthNotice = ({ text }: Props) => (
  <div
    role="alert"
    className="mt-[18px] rounded-[14px] bg-rose px-3.5 py-3 text-left text-sm text-coal"
  >
    {text}
  </div>
);
