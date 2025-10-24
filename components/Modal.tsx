"use client";

import clsx from "clsx";
import { ReactNode } from "react";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: "sm" | "md" | "lg";
}

export function Modal({
  title,
  open,
  onClose,
  children,
  width = "md"
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className={clsx("modal-content", `modal-${width}`)}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(33, 33, 33, 0.45);
          z-index: 999;
          padding: 16px;
        }
        .modal-content {
          width: 100%;
          background: var(--color-bg-white);
          border-radius: 16px;
          box-shadow: 0 16px 32px rgba(0, 90, 156, 0.15);
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-sm {
          max-width: 420px;
        }
        .modal-md {
          max-width: 520px;
        }
        .modal-lg {
          max-width: 640px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .modal-header h2 {
          font-size: 24px;
          font-weight: 600;
        }
        .icon-button {
          border: none;
          background: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          border-radius: 8px;
          padding: 4px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .icon-button:hover {
          color: var(--color-text-primary);
          background: rgba(0, 90, 156, 0.08);
        }
        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
