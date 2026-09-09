"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Toast } from "@/src/components/ui/feedback/Toast";
import { UserForm } from "@/src/components/users/UserForm";
import { UsersTable } from "@/src/components/users/UsersTable";

import type { UserDto } from "@/src/types/users/user.dto";

interface UsersPageProps {
  users: UserDto[];
}

type FeedbackState = {
  variant: "error" | "success";
  title: string;
  message: string;
} | null;

type ToastState = {
  variant: "error" | "success" | "info";
  title: string;
  message: string;
} | null;

export function UsersPage({ users }: UsersPageProps) {
  const router = useRouter();

  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [toast, setToast] = useState<ToastState>(null);

  function handleFeedback(
    variant: "error" | "success",
    title: string,
    message: string,
  ) {
    setFeedback({
      variant,
      title,
      message,
    });

    setToast({
      variant,
      title,
      message,
    });
  }

  function handleSuccess() {
    router.refresh();
  }

  return (
    <>
      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="users-feedback">
        {feedback && (
          <div
            className={
              feedback.variant === "success" ? "form-success" : "form-error"
            }
          >
            {feedback.variant === "success" ? (
              <CheckCircle2 />
            ) : (
              <TriangleAlert />
            )}

            <div>
              <strong>{feedback.title}</strong>
              <span>{feedback.message}</span>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={() => setFeedback(null)}
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="users-layout">
        <UsersTable users={users} />

        <UserForm onFeedback={handleFeedback} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
