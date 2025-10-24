"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "info",
  visible,
  onDismiss,
  duration = 2500
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(onDismiss, duration);
    return () => clearTimeout(timeout);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="material-icons">
        {type === "success" ? "check_circle" : type === "error" ? "error" : "info"}
      </span>
      <p>{message}</p>
      <style jsx>{`
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 12px;
          box-shadow: 0 12px 24px rgba(33, 33, 33, 0.15);
          color: #fff;
          font-weight: 500;
          z-index: 1000;
          animation: toast-in 0.25s ease-out;
        }
        .toast-success {
          background: var(--color-secondary);
        }
        .toast-error {
          background: var(--color-error);
        }
        .toast-info {
          background: var(--color-primary);
        }
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        p {
          font-size: 16px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
