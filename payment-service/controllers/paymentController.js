import Payment from "../models/Payment.js";
import axios from "axios";

export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Fetch order details from Order Service
    const order = await axios.get(`http://localhost:5003/orders/${orderId}`);

    const amount = order.data.totalPrice;

    // 2. Create payment
    const payment = await Payment.create({
      orderId,
      userId: order.data.userId,
      amount,
      status: "paid"
    });

    // 3. Update order status
    await axios.put(`http://localhost:5003/orders/${orderId}`, {
      status: "paid"
    });

    res.json({ message: "Payment successful", payment });

  } catch (err) {
    console.log("PAYMENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};
