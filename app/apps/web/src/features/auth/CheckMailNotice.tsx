import { Button } from "../../ui/Button.tsx";

interface Props {
  email: string;
  onOtherEmail: () => void;
}

export const CheckMailNotice = ({ email, onOtherEmail }: Props) => (
  <div>
    <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">Revisá tu mail</h1>
    <p className="mt-2.5 leading-normal text-muted">
      Te mandamos un link a <b className="text-ink">{email}</b>.
    </p>
    <Button variant="pill-ghost" onClick={onOtherEmail} className="mt-3.5">
      Usar otro email
    </Button>
  </div>
);
