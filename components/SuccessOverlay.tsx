"use client";

import { useEffect, useState } from "react";

interface SuccessOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export function SuccessOverlay({ visible, onComplete }: SuccessOverlayProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const timeout = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [visible, onComplete]);

  if (!show) return null;

  return (
    <div className="success-overlay">
      <div className="success-card">
        <span className="material-icons">check_circle</span>
        <p>Order saved</p>
      </div>
      <style jsx>{`
        .success-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(244, 247, 250, 0.25);
          z-index: 1200;
          backdrop-filter: blur(3px);
        }
        .success-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: var(--color-bg-white);
          border-radius: 18px;
          padding: 32px 48px;
          box-shadow: 0 18px 48px rgba(0, 90, 156, 0.2);
          animation: pop 0.32s ease-out;
        }
        .material-icons {
          font-size: 42px;
          color: var(--color-secondary);
        }
        p {
          font-size: 18px;
          font-weight: 600;
        }
        @keyframes pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
