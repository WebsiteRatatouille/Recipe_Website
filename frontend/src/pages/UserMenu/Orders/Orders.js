import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Orders.css";
import { startProgress, stopProgress } from "../../../utils/NProgress/NProgress";

const statusLabel = {
  pending: "Đang chờ",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy"
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | pending | paid
  const [acting, setActing] = useState({});
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Vui lòng đăng nhập để xem đơn hàng");
      navigate("/login");
      return;
    }
    fetchOrders(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async (user) => {
    try {
      setLoading(true);
      startProgress();
      const orderServiceUrl =
        process.env.REACT_APP_ORDER_URL || "http://localhost:5003";
      const { data } = await axios.get(
        `${orderServiceUrl}/orders/user/${user.id || user._id}`
      );
      setOrders(data || []);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const handleDelete = async (orderId) => {
    setActing((prev) => ({ ...prev, [orderId]: true }));
    try {
      const orderServiceUrl =
        process.env.REACT_APP_ORDER_URL || "http://localhost:5003";
      await axios.delete(`${orderServiceUrl}/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Đã xóa đơn hàng");
    } catch (err) {
      console.error("Lỗi khi xóa đơn:", err);
      const msg = err?.response?.data?.error || "Không thể xóa đơn hàng";
      toast.error(msg);
    } finally {
      setActing((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleMarkPaid = async (orderId) => {
    setActing((prev) => ({ ...prev, [orderId]: true }));
    try {
      const orderServiceUrl =
        process.env.REACT_APP_ORDER_URL || "http://localhost:5003";
      const { data } = await axios.patch(
        `${orderServiceUrl}/orders/${orderId}/status`,
        { status: "paid" }
      );
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      toast.success("Đơn đã được đánh dấu thanh toán");
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn:", err);
      const msg = err?.response?.data?.error || "Không thể cập nhật trạng thái";
      toast.error(msg);
    } finally {
      setActing((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleMomoPay = async (order) => {
    try {
      setActing((prev) => ({ ...prev, [order._id]: true }));
      const paymentServiceUrl =
        process.env.REACT_APP_PAYMENT_URL || "http://localhost:5004";
      const { data } = await axios.post(`${paymentServiceUrl}/payments`, {
        orderId: order._id
      });

      setQrData({
        url: data.payUrl,
        displayAmount: (order.totalPrice || 0).toLocaleString("vi-VN"),
        note: order._id,
        qr: data.qrUrl
      });
    } catch (err) {
      console.error("Lỗi tạo payment:", err);
      const msg = err?.response?.data?.error || "Không thể tạo thanh toán";
      toast.error(msg);
    } finally {
      setActing((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  const renderItems = (items = []) =>
    items.map((item) => (
      <div key={item.productId} className="order-item-row">
        <div className="order-item-title">{item.title || item.productId}</div>
        <div className="order-item-qty">x{item.quantity}</div>
        <div className="order-item-price">
          {(item.priceSnapshot || 0).toLocaleString("vi-VN")} ₫
        </div>
      </div>
    ));

  if (loading) {
    return (
      <div className="orders-page">
        <h1>Đơn hàng của tôi</h1>
        <div className="orders-placeholder">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Đơn hàng của tôi</h1>

      <div className="orders-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Đang chờ
        </button>
        <button
          className={filter === "paid" ? "active" : ""}
          onClick={() => setFilter("paid")}
        >
          Đã thanh toán
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-placeholder">Không có đơn hàng nào</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <div className="order-id">Mã đơn: {order._id}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className={`order-status order-status--${order.status}`}>
                  {statusLabel[order.status] || order.status}
                </div>
              </div>

              <div className="order-items">{renderItems(order.items)}</div>

              <div className="order-card__footer">
                <div className="order-total">
                  Tổng: {(order.totalPrice || 0).toLocaleString("vi-VN")} ₫
                </div>
                <div className="order-actions">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleMomoPay(order)}
                        disabled={acting[order._id]}
                        className="btn-primary"
                      >
                        Thanh toán
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={acting[order._id]}
                        className="btn-danger"
                      >
                        Xóa đơn
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {qrData && (
        <div className="qr-modal">
          <div className="qr-modal__content">
            <h3>Quét QR MoMo để thanh toán</h3>
            <p>Số tiền: {qrData.displayAmount} ₫</p>
            <p>Mã đơn: {qrData.note}</p>
            <div className="qr-box">
              <img
                src={
                  qrData.qr ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                    qrData.url
                  )}`
                }
                alt="QR MoMo"
              />
            </div>
            <div className="qr-link">{qrData.url}</div>
            <button className="btn-close" onClick={() => setQrData(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;

