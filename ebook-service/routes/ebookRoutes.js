import express from "express";
import {
  createEbook,
  getEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
} from "../controllers/ebookController.js";

const router = express.Router();

// Get all ebooks
router.get("/", getEbooks);

// Get ebook by id
router.get("/:id", getEbookById);

// Create ebook
router.post("/", createEbook);

// Update ebook
router.put("/:id", updateEbook);

// Delete ebook
router.delete("/:id", deleteEbook);

export default router;
