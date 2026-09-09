"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import type { FeedbackVariant } from "./FeedbackMessage";

interface ToastProps {
  variant: FeedbackVariant;
  title: string;
  message: string;
  onClose: () => void;
}

const config = {
  error: {
    icon: AlertCircle,
    className: "toast toast-error",
  },
  success: {
    icon: CheckCircle2,
    className: "toast toast-success",
  },
  info: {
    icon: Info,
    className: "toast toast-info",
  },
} satisfies Record<
  FeedbackVariant,
  {
    icon: typeof AlertCircle;
    className: string;
  }
>;

export function Toast({ variant, title, message, onClose }: ToastProps) {
  const { icon: Icon, className } = config[variant];

  return (
    <div className={className} role={variant === "error" ? "alert" : "status"}>
      <div className="toast-icon">
        <Icon />
      </div>

      <div className="toast-content">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <X />
      </button>
    </div>
  );
}
