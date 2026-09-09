"use client";

import {
    AlertCircle,
    CheckCircle2,
    Info,
    X,
} from "lucide-react";

export type FeedbackVariant =
  | "error"
  | "success"
  | "info";

interface FeedbackMessageProps {
  variant: FeedbackVariant;
  title: string;
  message: string;
  onClose?: () => void;
}

const config = {
  error: {
    icon: AlertCircle,
    className: "feedback-message feedback-message-error",
  },
  success: {
    icon: CheckCircle2,
    className:
      "feedback-message feedback-message-success",
  },
  info: {
    icon: Info,
    className: "feedback-message feedback-message-info",
  },
} satisfies Record<
  FeedbackVariant,
  {
    icon: typeof AlertCircle;
    className: string;
  }
>;

export function FeedbackMessage({
  variant,
  title,
  message,
  onClose,
}: FeedbackMessageProps) {
  const { icon: Icon, className } =
    config[variant];

  return (
    <div
      className={className}
      role={
        variant === "error"
          ? "alert"
          : "status"
      }
    >
      <div className="feedback-message-icon">
        <Icon />
      </div>

      <div className="feedback-message-content">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          className="feedback-message-close"
          onClick={onClose}
          aria-label="Cerrar mensaje"
        >
          <X />
        </button>
      )}
    </div>
  );
}