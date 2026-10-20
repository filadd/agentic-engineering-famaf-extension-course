import { createElement } from "react";
import { toast } from "sonner";

import { ErrorToast } from "./ErrorToast.tsx";

// A plain function, so an operation hook's onError can call it outside React.
export const showError = (text: string) =>
  toast.custom((id) => createElement(ErrorToast, { text, onClose: () => toast.dismiss(id) }));
