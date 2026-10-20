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
    <button type="button" onClick={onOtherEmail} className="mt-3.5 text-sm text-muted underline">
      Usar otro email
    </button>
  </div>
);
