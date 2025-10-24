"use client";

import { ORDER_TEMPLATES } from "../lib/orders";

interface TemplateModalProps {
  onSelect: (template: string) => void;
  sendingTemplate: string | null;
}

export function TemplateModal({ onSelect, sendingTemplate }: TemplateModalProps) {
  return (
    <div className="template-list">
      {ORDER_TEMPLATES.map((template) => {
        const isSending = sendingTemplate === template;
        return (
          <button
            key={template}
            className="template-button"
            onClick={() => onSelect(template)}
            disabled={isSending}
          >
            <span>{template}</span>
            {isSending ? (
              <span className="sending">
                <span className="material-icons">autorenew</span>
                Sending...
              </span>
            ) : (
              <span className="material-icons">send</span>
            )}
          </button>
        );
      })}
      <style jsx>{`
        .template-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .template-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(0, 90, 156, 0.18);
          border-radius: 16px;
          padding: 14px 18px;
          font-size: 15px;
          background: var(--color-bg-white);
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .template-button:hover:not(:disabled) {
          border-color: var(--color-primary);
          box-shadow: 0 12px 24px rgba(0, 90, 156, 0.12);
        }
        .template-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .material-icons {
          color: var(--color-primary);
        }
        .sending {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--color-primary);
          font-weight: 500;
        }
        .sending .material-icons {
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
