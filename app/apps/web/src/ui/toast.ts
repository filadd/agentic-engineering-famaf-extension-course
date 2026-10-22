import { createElement } from "react";
import { toast } from "sonner";

import { ErrorToast } from "./ErrorToast.tsx";
import { SuccessToast } from "./SuccessToast.tsx";

// A plain function, so an operation hook's onError can call it outside React.
export const showError = (text: string) =>
  toast.custom((id) => createElement(ErrorToast, { text, onClose: () => toast.dismiss(id) }));

export const showSuccess = (text: string) =>
  toast.custom((id) => createElement(SuccessToast, { text, onClose: () => toast.dismiss(id) }));
