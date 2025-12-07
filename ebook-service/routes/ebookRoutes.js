import express from "express";
import { createEbook, getEbooks, getEbookById } from "../controllers/ebookController.js";

const router = express.Router();

router.get("/", getEbooks);
router.get("/ebooks", getEbooks); // Thêm route /ebooks
router.get("/ebooks/:id", getEbookById); // Route /ebooks/:id
router.get("/:id", getEbookById);
router.post("/", createEbook);

export default router;
