"use client";

interface SummaryCardsProps {
  pendingCount: number;
  inTransitCount: number;
  onBulkUpload: () => void;
  onAddOrder: () => void;
}

export function SummaryCards({
  pendingCount,
  inTransitCount,
  onBulkUpload,
  onAddOrder
}: SummaryCardsProps) {
  return (
    <div className="summary-grid">
      <article className="card highlight">
        <div className="icon">
          <span className="material-icons">assignment</span>
        </div>
        <div>
          <p className="label">Orders Pending</p>
          <h3>{pendingCount}</h3>
        </div>
      </article>
      <article className="card">
        <div className="icon secondary">
          <span className="material-icons">local_shipping</span>
        </div>
        <div>
          <p className="label">In Transit</p>
          <h3>{inTransitCount}</h3>
        </div>
      </article>
      <article className="card callout">
        <div className="callout-text">
          <p className="label">Need to upload orders?</p>
          <h4>Bulk upload in one click</h4>
        </div>
        <div className="actions">
          <button className="button-secondary" onClick={onBulkUpload}>
            <span className="material-icons">file_upload</span>
            Bulk Upload
          </button>
          <button className="button-primary" onClick={onAddOrder}>
            <span className="material-icons">add</span>
            Add New Order
          </button>
        </div>
      </article>
      <style jsx>{`
        .summary-grid {
          display: grid;
          gap: 16px;
        }
        .card {
          background: var(--color-bg-white);
          border-radius: 20px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 14px 24px rgba(0, 90, 156, 0.1);
        }
        .highlight {
          border: 2px solid rgba(0, 90, 156, 0.15);
        }
        .icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(0, 90, 156, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }
        .icon.secondary {
          background: rgba(76, 175, 80, 0.16);
          color: var(--color-secondary);
        }
        .label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 6px 0 0;
        }
        .callout {
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
        }
        .callout-text h4 {
          margin: 6px 0 0;
          font-size: 20px;
          font-weight: 700;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .button-primary,
        .button-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .button-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 12px 22px rgba(255, 152, 0, 0.18);
        }
        .button-primary:hover {
          transform: translateY(-1px);
        }
        .button-secondary {
          background: rgba(0, 90, 156, 0.08);
          color: var(--color-primary);
        }
        .button-secondary:hover {
          transform: translateY(-1px);
        }
        @media (min-width: 768px) {
          .summary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .callout {
            grid-column: span 3;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
