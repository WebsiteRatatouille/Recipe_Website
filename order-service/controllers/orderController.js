import Order from "../models/Order.js";
import axios from "axios";

console.log("🔥🔥 ORDER CONTROLLER LOADED FROM THIS FILE 🔥🔥");

export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    console.log("Received order:", req.body);

    let total = 0;

    for (const item of items) {
      console.log("Fetching product:", item.productId);

      const url = `http://localhost:5001/ebooks/${item.productId}`;

      console.log("👉 URL BEING CALLED:", url);

      const response = await axios.get(url);

      console.log("Product fetched:", response.data);

      total += response.data.price * item.quantity;
    }

    const newOrder = await Order.create({
      userId,
      items,
      totalPrice: total,
    });

    res.json({ message: "Order created", order: newOrder });

  } catch (err) {
    console.log("ORDER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
