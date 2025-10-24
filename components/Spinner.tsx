"use client";

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="spinner">
      <span className="material-icons">autorenew</span>
      {label && <p>{label}</p>}
      <style jsx>{`
        .spinner {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--color-primary);
          font-weight: 500;
          animation: fade-in 0.2s ease-out;
        }
        .spinner .material-icons {
          animation: spin 1s linear infinite;
        }
        p {
          margin: 0;
          font-size: 16px;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
