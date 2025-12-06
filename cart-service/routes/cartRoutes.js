import express from "express";
import { addToCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

// POST /cart
router.post("/", addToCart);

// GET /cart/:userId
router.get("/:userId", getCart);

export default router;
