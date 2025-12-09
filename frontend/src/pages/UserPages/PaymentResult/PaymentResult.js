import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentResult() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Thanh toán thành công</h1>
      <p>Bạn sẽ được chuyển đến trang đơn hàng trong giây lát...</p>
      <button
        onClick={() => navigate("/orders")}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          background: "#333",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Xem đơn hàng của tôi
      </button>
    </div>
  );
}

export default PaymentResult;
