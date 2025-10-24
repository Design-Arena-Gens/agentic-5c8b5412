"use client";

import { MessageLogItem } from "../lib/orders";

interface OrderLogProps {
  messages: MessageLogItem[];
}

export function OrderLog({ messages }: OrderLogProps) {
  return (
    <div className="log-card">
      <header>
        <span className="material-icons">forum</span>
        <h3>Communication Log</h3>
      </header>
      <div className="log-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">mail_outline</span>
            <p>No messages yet. Send an update to notify the customer.</p>
          </div>
        ) : (
          messages.map((message) => (
            <article className="log-item" key={message.id}>
              <div className="avatar">
                <span className="material-icons">support_agent</span>
              </div>
              <div>
                <p>{message.text}</p>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
      <style jsx>{`
        .log-card {
          background: var(--color-bg-white);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 14px 24px rgba(0, 90, 156, 0.12);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        header h3 {
          font-size: 18px;
          font-weight: 700;
        }
        .log-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 360px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .log-item {
          display: flex;
          gap: 12px;
          background: rgba(0, 90, 156, 0.04);
          border-radius: 16px;
          padding: 12px 14px;
        }
        .log-item p {
          margin: 0 0 6px;
          font-size: 15px;
          line-height: 1.5;
        }
        .timestamp {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(0, 90, 156, 0.15);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 36px 12px;
          text-align: center;
          color: var(--color-text-secondary);
        }
        .empty-state .material-icons {
          font-size: 32px;
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
