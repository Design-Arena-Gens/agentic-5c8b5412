"use client";

import { useMemo, useRef, useState } from "react";
import { mockOrders } from "../data/mockOrders";
import {
  Order,
  MessageLogItem,
  simulatePorterBooking
} from "../lib/orders";
import { SummaryCards } from "../components/SummaryCards";
import { SearchBar } from "../components/SearchBar";
import { OrderList } from "../components/OrderList";
import { OrderDetails } from "../components/OrderDetails";
import { OrderLog } from "../components/OrderLog";
import { Modal } from "../components/Modal";
import { OrderForm } from "../components/OrderForm";
import { TemplateModal } from "../components/TemplateModal";
import { Spinner } from "../components/Spinner";
import { Toast, ToastType } from "../components/Toast";
import { SuccessOverlay } from "../components/SuccessOverlay";

type BookingState = "idle" | "loading" | "success";
type OrderFormMode = "add" | "edit";

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    mockOrders[0]?.id ?? ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [orderFormMode, setOrderFormMode] = useState<OrderFormMode>("add");
  const [orderPending, setOrderPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [bookingResult, setBookingResult] =
    useState<{ price: string; eta_minutes: number } | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [sendingTemplate, setSendingTemplate] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({ message: "", type: "info", visible: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return orders;
    return orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(term) ||
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_phone.toLowerCase().includes(term) ||
        order.address.toLowerCase().includes(term)
      );
    });
  }, [orders, searchTerm]);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? orders[0];

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "Pending").length,
    [orders]
  );
  const inTransitCount = useMemo(
    () => orders.filter((order) => order.status === "In Transit").length,
    [orders]
  );

  const openAddOrderModal = () => {
    setOrderFormMode("add");
    setOrderModalOpen(true);
  };

  const openEditOrderModal = () => {
    setOrderFormMode("edit");
    setOrderModalOpen(true);
  };

  const generateOrderId = () => {
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `OD${random}`;
  };

  const handleOrderSubmit = async (payload: Omit<Order, "messages">) => {
    setOrderPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (orderFormMode === "add") {
      const newOrder: Order = {
        ...payload,
        id: payload.id || generateOrderId(),
        messages: [
          {
            id: crypto.randomUUID(),
            text: "Order created successfully.",
            timestamp: new Date().toISOString()
          }
        ]
      };
      setOrders((prev) => [newOrder, ...prev]);
      setSelectedOrderId(newOrder.id);
    } else if (selectedOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                customer_name: payload.customer_name,
                customer_phone: payload.customer_phone,
                address: payload.address,
                status: payload.status
              }
            : order
        )
      );
    }
    setOrderModalOpen(false);
    setOrderPending(false);
    setShowSuccess(true);
  };

  const handleBookPickup = async () => {
    if (!selectedOrder) return;
    setBookingModalOpen(true);
    setBookingState("loading");
    setBookingResult(null);
    const result = await simulatePorterBooking(selectedOrder.id);
    setBookingState(result.status === "success" ? "success" : "idle");
    setBookingResult(result);
    setToast({
      message: "Pickup booked successfully!",
      type: "success",
      visible: true
    });
  };

  const handleSendTemplate = async (template: string) => {
    if (!selectedOrder) return;
    setSendingTemplate(template);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const message: MessageLogItem = {
      id: crypto.randomUUID(),
      text: template,
      timestamp: new Date().toISOString()
    };
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              messages: [...(order.messages ?? []), message]
            }
          : order
      )
    );
    setSendingTemplate(null);
    setTemplateModalOpen(false);
    setToast({
      message: "Message sent",
      type: "success",
      visible: true
    });
  };

  const handleBulkUpload = () => {
    fileInputRef.current?.click();
  };

  const onBulkFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = "";
    setToast({
      message: "Orders Uploaded!",
      type: "success",
      visible: true
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>Porter Logistics Control Center</h1>
          <p className="subtitle">
            Track deliveries, manage pickups, and keep customers informed with one unified workspace.
          </p>
        </div>
        <div className="hero-cta">
          <button className="hero-button" onClick={openAddOrderModal}>
            <span className="material-icons">add_circle</span>
            Add New Order
          </button>
          <button className="hero-button ghost" onClick={handleBulkUpload}>
            <span className="material-icons">file_upload</span>
            Bulk Upload
          </button>
        </div>
      </section>

      <SummaryCards
        pendingCount={pendingCount}
        inTransitCount={inTransitCount}
        onBulkUpload={handleBulkUpload}
        onAddOrder={openAddOrderModal}
      />

      <section className="content">
        <div className="left-panel">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <h2 className="section-title">Orders</h2>
          <OrderList
            orders={filteredOrders}
            selectedId={selectedOrder?.id ?? null}
            onSelect={(order) => setSelectedOrderId(order.id)}
          />
        </div>
        <div className="right-panel">
          {selectedOrder ? (
            <>
              <OrderDetails
                order={selectedOrder}
                onEdit={openEditOrderModal}
                onBookPickup={handleBookPickup}
                bookingState={bookingState}
                bookingResult={bookingResult}
                onBookingModalClose={() => {
                  setBookingModalOpen(false);
                  setBookingState("idle");
                  setBookingResult(null);
                }}
                onSendUpdate={() => setTemplateModalOpen(true)}
              />
              <OrderLog messages={selectedOrder.messages ?? []} />
            </>
          ) : (
            <div className="empty-details">
              <span className="material-icons">select_all</span>
              <h3>Select an order to view details</h3>
            </div>
          )}
        </div>
      </section>

      <Modal
        title={orderFormMode === "add" ? "Add New Order" : "Edit Order"}
        open={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      >
        <OrderForm
          mode={orderFormMode}
          initial={orderFormMode === "edit" ? selectedOrder : undefined}
          onSubmit={handleOrderSubmit}
          onCancel={() => setOrderModalOpen(false)}
          submitting={orderPending}
        />
      </Modal>

      <Modal
        title="Book Pickup"
        open={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingState("idle");
          setBookingResult(null);
        }}
        width="sm"
      >
        {bookingState === "loading" && <Spinner label="Contacting Porter..." />}
        {bookingState === "success" && bookingResult && (
          <div className="booking-card">
            <span className="material-icons success">check_circle</span>
            <h3>Booking Confirmed!</h3>
            <p>
              Price: <strong>₹{bookingResult.price}</strong>
            </p>
            <p>Driver is {bookingResult.eta_minutes} mins away.</p>
            <button
              className="button-primary"
              onClick={() => {
                setBookingModalOpen(false);
                setBookingState("idle");
                setBookingResult(null);
              }}
            >
              Great!
            </button>
          </div>
        )}
      </Modal>

      <Modal
        title="Send Update"
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        width="sm"
      >
        <TemplateModal
          onSelect={handleSendTemplate}
          sendingTemplate={sendingTemplate}
        />
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onBulkFileSelected}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={closeToast}
      />

      <SuccessOverlay
        visible={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />

      <style jsx>{`
        .page {
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .hero {
          background: linear-gradient(
              135deg,
              rgba(0, 90, 156, 0.85),
              rgba(76, 175, 80, 0.85)
            ),
            url("https://images.unsplash.com/photo-1455906876003-298dd8c44dc0?auto=format&fit=crop&w=1200&q=60")
              center/cover;
          border-radius: 24px;
          padding: 32px 28px;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 24px 42px rgba(0, 90, 156, 0.2);
        }
        .eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
        }
        .subtitle {
          font-size: 16px;
          max-width: 540px;
          opacity: 0.9;
        }
        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hero-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: none;
          border-radius: 14px;
          padding: 12px 18px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          backdrop-filter: blur(4px);
        }
        .hero-button:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .hero-button.ghost {
          background: rgba(0, 0, 0, 0.15);
        }
        .content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .left-panel,
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .section-title {
          font-size: 24px;
          font-weight: 700;
        }
        .empty-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--color-bg-white);
          border-radius: 20px;
          padding: 48px 24px;
          color: var(--color-text-secondary);
        }
        .empty-details .material-icons {
          font-size: 36px;
          color: var(--color-primary);
        }
        .booking-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: center;
          align-items: center;
        }
        .booking-card .success {
          color: var(--color-secondary);
          font-size: 42px;
        }
        .booking-card h3 {
          font-size: 20px;
          margin: 4px 0;
        }
        .booking-card p {
          margin: 0;
          font-size: 16px;
        }
        .booking-card .button-primary {
          margin-top: 12px;
          background: var(--color-secondary);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(76, 175, 80, 0.24);
        }
        @media (min-width: 1024px) {
          .hero {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .hero-cta {
            justify-content: flex-end;
          }
          .content {
            flex-direction: row;
            align-items: flex-start;
          }
          .left-panel {
            flex: 0 0 38%;
          }
          .right-panel {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}
