import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Tạo giỏ hàng mới
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }]
      });
    } else {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        // Tăng số lượng nếu đã có
        existingItem.quantity += quantity;
      } else {
        // Thêm sản phẩm mới
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Tạo giỏ hàng rỗng nếu chưa có
      cart = await Cart.create({ userId, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Xóa item nếu quantity <= 0
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

