import express from "express";
import { createEbook, getEbooks, getEbookById } from "../controllers/ebookController.js";

const router = express.Router();

// Get all ebooks
router.get("/", getEbooks);

// Get ebook by id
router.get("/:id", getEbookById);

// Create ebook
router.post("/", createEbook);

export default router;
