"use client";

import { format } from "date-fns";
import { Order } from "../lib/orders";

interface OrderDetailsProps {
  order: Order;
  onEdit: () => void;
  onBookPickup: () => void;
  bookingState: "idle" | "loading" | "success";
  bookingResult?: { price: string; eta_minutes: number } | null;
  onBookingModalClose: () => void;
  onSendUpdate: () => void;
}

export function OrderDetails({
  order,
  onEdit,
  onBookPickup,
  bookingState,
  bookingResult,
  onBookingModalClose,
  onSendUpdate
}: OrderDetailsProps) {
  const statusColor =
    order.status === "Pending"
      ? "status-pending"
      : order.status === "In Transit"
      ? "status-intransit"
      : "status-delivered";

  return (
    <div className="details-card">
      <header>
        <div>
          <p className="label">Order</p>
          <h2>{order.id}</h2>
        </div>
        <button className="icon-chip" onClick={onEdit}>
          <span className="material-icons">edit</span>
          Edit Order
        </button>
      </header>
      <section className="customer">
        <div>
          <p className="label">Customer</p>
          <h3>{order.customer_name}</h3>
          <p className="subtext">{order.customer_phone}</p>
        </div>
        <div>
          <p className="label">Pickup Window</p>
          <h3>
            {format(new Date(order.pickup_time), "dd MMM yyyy, hh:mm a")}
          </h3>
          <p className="subtext">Ready to dispatch</p>
        </div>
      </section>
      <section className="address">
        <p className="label">Address</p>
        <p className="address-text">{order.address}</p>
      </section>
      <section className="status">
        <div className={`status-chip ${statusColor}`}>
          <span className="material-icons">
            {order.status === "Pending"
              ? "pending_actions"
              : order.status === "In Transit"
              ? "local_shipping"
              : "check_circle"}
          </span>
          <span>{order.status}</span>
        </div>
        <div className="cta-row">
          <button className="button-primary" onClick={onBookPickup}>
            <span className="material-icons">hail</span>
            Book Pickup
          </button>
          <button className="button-accent" onClick={onSendUpdate}>
            <span className="material-icons">sms</span>
            Send Update
          </button>
        </div>
      </section>
      {bookingState === "success" && bookingResult && (
        <div className="booking-success">
          <div className="badge">
            <span className="material-icons">verified</span>
          </div>
          <div>
            <h4>Booking Confirmed!</h4>
            <p>Price: ₹{bookingResult.price}</p>
            <p>Driver is {bookingResult.eta_minutes} mins away.</p>
          </div>
          <button className="icon-chip subtle" onClick={onBookingModalClose}>
            Close
          </button>
        </div>
      )}
      <style jsx>{`
        .details-card {
          background: var(--color-bg-white);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 14px 24px rgba(0, 90, 156, 0.12);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        h2 {
          font-size: 24px;
          font-weight: 700;
        }
        h3 {
          font-size: 18px;
          font-weight: 600;
        }
        .label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .subtext {
          color: var(--color-text-secondary);
          font-size: 14px;
        }
        .customer {
          display: grid;
          gap: 16px;
        }
        .address-text {
          font-size: 16px;
          line-height: 1.6;
        }
        .status {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .status-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
        }
        .status-pending {
          background: rgba(255, 152, 0, 0.12);
          color: #ff9800;
        }
        .status-intransit {
          background: rgba(0, 90, 156, 0.12);
          color: var(--color-primary);
        }
        .status-delivered {
          background: rgba(76, 175, 80, 0.15);
          color: var(--color-secondary);
        }
        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .button-primary,
        .button-accent {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          padding: 12px 18px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .button-primary {
          background: var(--color-primary);
          color: #fff;
          box-shadow: 0 12px 22px rgba(0, 90, 156, 0.2);
        }
        .button-primary:hover {
          transform: translateY(-1px);
        }
        .button-accent {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 12px 22px rgba(255, 152, 0, 0.18);
        }
        .button-accent:hover {
          transform: translateY(-1px);
        }
        .icon-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: rgba(0, 90, 156, 0.1);
          color: var(--color-primary);
          border-radius: 999px;
          padding: 8px 14px;
          cursor: pointer;
          font-weight: 600;
        }
        .icon-chip:hover {
          background: rgba(0, 90, 156, 0.16);
        }
        .icon-chip.subtle {
          background: rgba(33, 33, 33, 0.05);
          color: var(--color-text-secondary);
        }
        .booking-success {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(76, 175, 80, 0.08);
          border-radius: 16px;
          padding: 18px;
          animation: fade-in 0.25s ease-out;
        }
        .booking-success h4 {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 700;
        }
        .booking-success p {
          margin: 0;
          font-size: 15px;
          color: var(--color-text-primary);
        }
        .badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--color-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 10px 18px rgba(76, 175, 80, 0.25);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 768px) {
          .customer {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
