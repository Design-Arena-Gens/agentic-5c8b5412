"use client";

import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { Order } from "../lib/orders";

interface OrderListProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (order: Order) => void;
}

export function OrderList({ orders, selectedId, onSelect }: OrderListProps) {
  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <div className="empty">
          <span className="material-icons">inbox</span>
          <p>No orders found. Try adjusting your filters.</p>
        </div>
      ) : (
        orders.map((order) => (
          <button
            key={order.id}
            className={clsx("order-row", { active: selectedId === order.id })}
            onClick={() => onSelect(order)}
          >
            <div className="avatar">
              <span className="material-icons">
                {order.status === "Pending"
                  ? "inventory_2"
                  : order.status === "In Transit"
                  ? "local_shipping"
                  : "check_circle"}
              </span>
            </div>
            <div className="details">
              <div className="top">
                <h4>{order.customer_name}</h4>
                <span className="order-id">{order.id}</span>
              </div>
              <p className="address">{order.address}</p>
              <div className="meta">
                <span className={clsx("status-pill", order.status.toLowerCase().replace(" ", "-"))}>
                  {order.status}
                </span>
                <span className="time">
                  Pickup{" "}
                  {formatDistanceToNow(new Date(order.pickup_time), {
                    addSuffix: true
                  })}
                </span>
              </div>
            </div>
            <span className="material-icons arrow">chevron_right</span>
          </button>
        ))
      )}
      <style jsx>{`
        .order-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .order-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 14px 18px;
          border-radius: 18px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 12px 22px rgba(0, 90, 156, 0.06);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            border-color 0.2s ease;
          text-align: left;
        }
        .order-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(0, 90, 156, 0.1);
        }
        .order-row.active {
          border-color: var(--color-primary);
          box-shadow: 0 18px 28px rgba(0, 90, 156, 0.18);
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: var(--color-primary);
          box-shadow: 0 12px 18px rgba(0, 90, 156, 0.22);
        }
        .avatar .material-icons {
          font-size: 24px;
        }
        .details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .top {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }
        .order-id {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .address {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin: 0;
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .status-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pending {
          background: rgba(255, 152, 0, 0.15);
          color: #ff9800;
        }
        .in {
          background: rgba(0, 90, 156, 0.15);
          color: var(--color-primary);
        }
        .in-transit {
          background: rgba(0, 90, 156, 0.15);
          color: var(--color-primary);
        }
        .delivered {
          background: rgba(76, 175, 80, 0.16);
          color: var(--color-secondary);
        }
        .time {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .arrow {
          color: var(--color-text-secondary);
        }
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 40px 12px;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}
