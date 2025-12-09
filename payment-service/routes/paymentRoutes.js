import express from "express";
import {
  processPayment,
  confirmPayment,
  createMomoPayment,
  momoIpnHandler,
  localConfirmByOrder
} from "../controllers/paymentController.js";

const router = express.Router();

// Thanh toán momo://app (cũ, dùng QR / deep link)
router.post("/", processPayment);
router.post("/:paymentId/confirm", confirmPayment);

// Local-only: xác nhận thanh toán theo orderId (dùng khi IPN không tới được localhost)
router.post("/local-confirm/:orderId", localConfirmByOrder);

// MoMo sandbox v2 (redirect qua web/app MoMo)
router.post("/momo/create", createMomoPayment);
router.post("/momo-ipn", momoIpnHandler);

export default router;
