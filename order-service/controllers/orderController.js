import Order from "../models/Order.js";
import axios from "axios";

const EBOOK_URL = (process.env.EBOOK_URL || "http://localhost:5001").replace(
  /\/$/,
  ""
);
const CART_URL = (process.env.CART_URL || "http://localhost:5002").replace(
  /\/$/,
  ""
);

const ALLOWED_STATUS = ["pending", "paid", "cancelled"];

const fetchEbookSnapshot = async (productId) => {
  const { data } = await axios.get(`${EBOOK_URL}/${productId}`);
  return {
    title: data.title || data.name || "",
    price: Number(data.price) || 0
  };
};

const resolveItems = async (userId, items) => {
  // Nếu client không gửi items, lấy từ cart-service
  if (items && items.length > 0) return items;
  if (!userId) throw new Error("userId is required to load cart items");

  const { data } = await axios.get(`${CART_URL}/cart/${userId}`);
  return data?.items || [];
};

const isSameOrderItems = (itemsA = [], itemsB = []) => {
  if (itemsA.length !== itemsB.length) return false;
  const sortedA = [...itemsA].sort((a, b) => a.productId.localeCompare(b.productId));
  const sortedB = [...itemsB].sort((a, b) => a.productId.localeCompare(b.productId));
  return sortedA.every(
    (item, idx) =>
      item.productId === sortedB[idx].productId &&
      Number(item.quantity) === Number(sortedB[idx].quantity)
  );
};

export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const rawItems = await resolveItems(userId, items);

    if (!rawItems || rawItems.length === 0) {
      return res
        .status(400)
        .json({ error: "No items found to create order" });
    }

    const detailedItems = [];
    let total = 0;

    for (const item of rawItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({ error: "Each item requires productId and quantity > 0" });
      }

      const snapshot = await fetchEbookSnapshot(item.productId);
      const lineTotal = snapshot.price * item.quantity;
      total += lineTotal;

      detailedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        title: snapshot.title,
        priceSnapshot: snapshot.price
      });
    }

    // Chặn tạo trùng: nếu đã có đơn pending cùng user và cùng danh sách items
    const existingPendingOrders = await Order.find({ userId, status: "pending" });
    const duplicated = existingPendingOrders.find((o) =>
      isSameOrderItems(
        o.items?.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        detailedItems
      )
    );
    if (duplicated) {
      return res
        .status(200)
        .json({ message: "Order already exists (pending)", order: duplicated });
    }

    const newOrder = await Order.create({
      userId,
      items: detailedItems,
      totalPrice: total,
      status: "pending"
    });

    return res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    console.log("ORDER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be deleted" });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ message: "Order deleted", orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
