import Payment from "../models/Payment.js";
import axios from "axios";

const ORDER_URL = (process.env.ORDER_URL || "http://localhost:5003").replace(
  /\/$/,
  ""
);
const MOMO_PHONE = process.env.MOMO_PHONE || "0383148283";

export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    // 1. Fetch order details from Order Service
    const { data: order } = await axios.get(`${ORDER_URL}/orders/${orderId}`);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const amount = Math.max(0, Number(order.totalPrice) || 0);
    const note = `ORDER_${orderId}`;
    const payUrl = `momo://app?action=pay&phone=${MOMO_PHONE}&amount=${amount}&note=${encodeURIComponent(
      note
    )}`;

    // 2. Create payment (pending)
    const payment = await Payment.create({
      orderId,
      userId: order.userId,
      amount,
      payUrl,
      status: "pending"
    });

    return res.status(201).json({
      message: "Payment created",
      payUrl,
      paymentId: payment._id,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        payUrl
      )}`
    });
  } catch (err) {
    console.log("PAYMENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = "paid";
    await payment.save();

    // Update order status
    await axios.patch(`${ORDER_URL}/orders/${payment.orderId}/status`, {
      status: "paid"
    });

    res.json({ message: "Payment confirmed", payment });
  } catch (err) {
    console.log("PAYMENT CONFIRM ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};
