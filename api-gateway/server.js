import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
app.use(cors());
// Không parse body tại gateway để tránh làm mất raw body khi proxy tới service

// ROOT
app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

// DEBUG LOG
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});



app.use(
  "/ebooks",
  createProxyMiddleware({
    target: process.env.EBOOK_URL,
    changeOrigin: true,
    
  })
);

// CART SERVICE
app.use(
  "/cart",
  createProxyMiddleware({
    target: process.env.CART_URL,
    changeOrigin: true
  })
);

// ORDER SERVICE
app.use(
  "/orders",
  createProxyMiddleware({
    target: process.env.ORDER_URL,
    changeOrigin: true
  })
);

// PAYMENT SERVICE
app.use(
  "/payments",
  createProxyMiddleware({
    target: process.env.PAYMENT_URL,
    changeOrigin: true,
    
  })
);

app.listen(process.env.PORT, () =>
  console.log(`API Gateway running on ${process.env.PORT}`)
);
