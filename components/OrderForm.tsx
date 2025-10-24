"use client";

import { useState } from "react";
import { Order, OrderStatus } from "../lib/orders";

interface OrderFormProps {
  mode: "add" | "edit";
  initial?: Partial<Order>;
  onSubmit: (payload: Omit<Order, "messages">) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = ["Pending", "In Transit", "Delivered"];

export function OrderForm({
  mode,
  initial = {},
  onSubmit,
  onCancel,
  submitting
}: OrderFormProps) {
  const [form, setForm] = useState({
    customer_name: initial.customer_name ?? "",
    customer_phone: initial.customer_phone ?? "",
    address: initial.address ?? "",
    status: (initial.status as OrderStatus) ?? "Pending"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof typeof form,
    value: string | OrderStatus
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.customer_name.trim()) {
      nextErrors.customer_name = "Customer name is required.";
    }
    if (!form.customer_phone.trim()) {
      nextErrors.customer_phone = "Customer phone is required.";
    } else if (!/^\+?\d[\d\s-]{9,}$/.test(form.customer_phone.trim())) {
      nextErrors.customer_phone = "Enter a valid phone number.";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Address is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) return;

    await onSubmit({
      id: initial.id ?? "",
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      address: form.address.trim(),
      status: form.status,
      pickup_time: initial.pickup_time ?? new Date().toISOString()
    });
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="customer_name">Customer Name</label>
        <input
          id="customer_name"
          type="text"
          value={form.customer_name}
          onChange={(event) => handleChange("customer_name", event.target.value)}
          placeholder="Enter customer name"
          required
        />
        {errors.customer_name && <p className="error">{errors.customer_name}</p>}
      </div>
      <div className="field">
        <label htmlFor="customer_phone">Customer Phone</label>
        <input
          id="customer_phone"
          type="tel"
          value={form.customer_phone}
          onChange={(event) => handleChange("customer_phone", event.target.value)}
          placeholder="+91 9000000000"
          required
        />
        {errors.customer_phone && (
          <p className="error">{errors.customer_phone}</p>
        )}
      </div>
      <div className="field">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          value={form.address}
          onChange={(event) => handleChange("address", event.target.value)}
          placeholder="Enter delivery address"
          required
          rows={4}
        />
        {errors.address && <p className="error">{errors.address}</p>}
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <div className="select-wrapper">
          <select
            id="status"
            value={form.status}
            onChange={(event) => handleChange("status", event.target.value as OrderStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="material-icons">expand_more</span>
        </div>
      </div>
      <div className="actions">
        <button
          type="button"
          className="button-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="button-primary" disabled={submitting}>
          {submitting ? (
            <span className="loading">
              <span className="material-icons">autorenew</span>
              Saving...
            </span>
          ) : (
            "Save Order"
          )}
        </button>
      </div>
      <style jsx>{`
        .order-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        input,
        textarea,
        select {
          border: 1px solid rgba(0, 90, 156, 0.15);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          background: var(--color-bg-white);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(0, 90, 156, 0.15);
        }
        textarea {
          resize: vertical;
        }
        .error {
          font-size: 14px;
          color: var(--color-error);
        }
        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        select {
          appearance: none;
          width: 100%;
          padding-right: 40px;
        }
        .select-wrapper .material-icons {
          position: absolute;
          right: 12px;
          color: var(--color-text-secondary);
          pointer-events: none;
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
        .button-primary,
        .button-secondary {
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .button-primary {
          background: var(--color-primary);
          color: #fff;
          box-shadow: 0 10px 18px rgba(0, 90, 156, 0.2);
        }
        .button-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 22px rgba(0, 90, 156, 0.24);
        }
        .button-secondary {
          background: rgba(0, 90, 156, 0.08);
          color: var(--color-primary);
        }
        .button-secondary:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .button-primary:disabled,
        .button-secondary:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }
        .loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .loading .material-icons {
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
    </form>
  );
}
