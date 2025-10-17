"use client";
import { toast, Id } from "react-toastify";

export function showLoading(message: string): Id {
  return toast.loading(message);
}

export function showSuccess(id: Id, message: string, autoClose = 2000) {
  toast.update(id, {
    render: message,
    type: "success",
    isLoading: false,
    autoClose,
  });
}

export function showError(id: Id, message: string, autoClose = 3000) {
  toast.update(id, {
    render: message,
    type: "error",
    isLoading: false,
    autoClose,
  });
}
