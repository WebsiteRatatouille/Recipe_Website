import express from "express";
import { processPayment, confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", processPayment);
router.post("/:paymentId/confirm", confirmPayment);

export default router;
