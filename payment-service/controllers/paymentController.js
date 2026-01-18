import Payment from "../models/Payment.js";
import axios from "axios";
import crypto from "crypto";

const ORDER_URL = (process.env.ORDER_URL || "").replace(/\/$/, "");

// Endpoint MoMo Sandbox (ưu tiên từ .env, fallback URL mặc định)
const MOMO_ENDPOINT =
  process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";

/* ============================================================
    1) Deep-link momo://app
=============================================================== */
export const processPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ error: "orderId is required" });

        const { data: order } = await axios.get(`${ORDER_URL}/orders/${orderId}`);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const amount = Number(order.totalPrice) || 0;
        const phone = process.env.MOMO_PHONE || "0383148283";
        const note = `ORDER_${orderId}`;

        const payUrl = `momo://app?action=pay&phone=${phone}&amount=${amount}&note=${encodeURIComponent(note)}`;

        const payment = await Payment.create({
            orderId,
            userId: order.userId,
            amount,
            payUrl,
            status: "pending",
        });

        res.status(201).json({
            message: "Payment created",
            paymentId: payment._id,
            payUrl,
        });
    } catch (err) {
        console.log("DEEP LINK ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/* ============================================================
    5) Local-only confirm (dùng để test trên localhost khi IPN không tới được)
=============================================================== */
export const localConfirmByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ error: "orderId is required" });
        }

        // Tìm payment mới nhất cho order này
        const payment = await Payment.findOne({ orderId }).sort({ createdAt: -1 });
        if (!payment) {
            return res.status(404).json({ error: "Payment not found for this order" });
        }

        payment.status = "paid";
        await payment.save();

        // Cập nhật trạng thái order trong order-service
        try {
            await axios.patch(`${ORDER_URL}/orders/${orderId}/status`, {
                status: "paid",
            });
        } catch (err) {
            console.log("Failed to update order status from localConfirmByOrder:", err.message);
        }

        return res.json({ message: "Local confirm success", payment });
    } catch (err) {
        console.log("LOCAL CONFIRM ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/* ============================================================
    2) Xác nhận thanh toán (dùng cho deep-link / demo)
=============================================================== */
export const confirmPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ error: "Payment not found" });

        payment.status = "paid";
        await payment.save();

        await axios.patch(`${ORDER_URL}/orders/${payment.orderId}/status`, {
            status: "paid",
        });

        res.json({ message: "Payment confirmed", payment });
    } catch (err) {
        console.log("PAYMENT CONFIRM ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/* ============================================================
    3) Tạo thanh toán MoMo Sandbox
=============================================================== */
export const createMomoPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ error: "orderId is required" });

        const { data: order } = await axios.get(`${ORDER_URL}/orders/${orderId}`);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const amount = Number(order.totalPrice) || 0;

        // ENV
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const redirectUrl = process.env.MOMO_REDIRECT_URL;
        const ipnUrl = process.env.MOMO_IPN_URL;

        const requestId = `${partnerCode}-${Date.now()}`;
        const orderIdMomo = `${orderId}-${Date.now()}`;

        // Body chuẩn theo tài liệu MoMo (KHÔNG thêm biến linh tinh)
        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount: String(amount),
            orderId: orderIdMomo,
            orderInfo: `Thanh toan don hang ${orderId}`,
            redirectUrl,
            ipnUrl,
            extraData: "",
            requestType: "captureWallet",
        };

        // Ký signature theo thứ tự CHUẨN
        const rawSignature =
            `accessKey=${requestBody.accessKey}` +
            `&amount=${requestBody.amount}` +
            `&extraData=${requestBody.extraData}` +
            `&ipnUrl=${requestBody.ipnUrl}` +
            `&orderId=${requestBody.orderId}` +
            `&orderInfo=${requestBody.orderInfo}` +
            `&partnerCode=${requestBody.partnerCode}` +
            `&redirectUrl=${requestBody.redirectUrl}` +
            `&requestId=${requestBody.requestId}` +
            `&requestType=${requestBody.requestType}`;

        requestBody.signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        // =============== DEBUG LOG ===============
        console.log("===== RAW SIGNATURE =====");
        console.log(rawSignature);

        console.log("===== BODY SEND TO MOMO =====");
        console.log(requestBody);
        // =========================================

        // Gọi MoMo
        const momoRes = await axios.post(MOMO_ENDPOINT, requestBody, {
            headers: { "Content-Type": "application/json" },
        });

        // Lưu Payment
        const payment = await Payment.create({
            orderId,
            userId: order.userId,
            amount,
            status: "pending",
            payUrl: momoRes.data.payUrl,
            momoOrderId: orderIdMomo,
        });

        return res.status(201).json({
            message: "MoMo payment created",
            payUrl: momoRes.data.payUrl,
            paymentId: payment._id,
            momo: momoRes.data,
        });
    } catch (err) {
        console.log("===== MOMO ERROR RESPONSE =====");
        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: err.response?.data || err.message,
        });
    }
};

/* ============================================================
    4) IPN Callback
=============================================================== */
export const momoIpnHandler = async (req, res) => {
    try {
        const data = req.body;
        const secretKey = process.env.MOMO_SECRET_KEY;

        const rawSignature =
            `accessKey=${data.accessKey}&amount=${data.amount}` +
            `&extraData=${data.extraData}` +
            `&message=${data.message}` +
            `&orderId=${data.orderId}` +
            `&orderInfo=${data.orderInfo}` +
            `&orderType=${data.orderType}` +
            `&partnerCode=${data.partnerCode}` +
            `&payType=${data.payType}` +
            `&requestId=${data.requestId}` +
            `&responseTime=${data.responseTime}` +
            `&resultCode=${data.resultCode}` +
            `&transId=${data.transId}`;

        const checkSignature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        if (checkSignature !== data.signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        console.log("IPN RECEIVED:", data);

        // Tìm payment tương ứng theo momoOrderId (orderId mà gửi lên MoMo)
        const payment = await Payment.findOne({ momoOrderId: data.orderId });
        if (!payment) {
            console.log("Payment not found for momo orderId", data.orderId);
            return res.json({ message: "IPN received, payment not found", resultCode: 0 });
        }

        if (Number(data.resultCode) === 0) {
            // Thanh toán thành công
            payment.status = "paid";
            await payment.save();

            // Cập nhật trạng thái đơn hàng trong order-service
            try {
                await axios.patch(`${ORDER_URL}/orders/${payment.orderId}/status`, {
                    status: "paid",
                });
            } catch (err) {
                console.log("Failed to update order status from IPN:", err.message);
            }
        } else {
            // Thanh toán thất bại hoặc bị hủy
            payment.status = "failed";
            await payment.save();
        }

        return res.json({ message: "IPN processed", resultCode: 0 });
    } catch (err) {
        console.log("IPN ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};
