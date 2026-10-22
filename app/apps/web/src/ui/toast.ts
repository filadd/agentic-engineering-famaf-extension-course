import { createElement } from "react";
import { toast } from "sonner";

import { Toast } from "./Toast.tsx";

const show = (variant: "success" | "error", text: string) =>
  toast.custom((id) => createElement(Toast, { variant, text, onClose: () => toast.dismiss(id) }));

// Plain functions, so an operation hook's onError can call them outside React.
export const showError = (text: string) => show("error", text);

export const showSuccess = (text: string) => show("success", text);
