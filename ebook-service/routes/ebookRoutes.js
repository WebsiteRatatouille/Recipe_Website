import express from "express";
import {
  createEbook,
  getEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
  getEbookComments,
  addEbookComment,
  updateEbookComment,
  deleteEbookComment,
} from "../controllers/ebookController.js";

const router = express.Router();

// Get all ebooks
router.get("/", getEbooks);

// Get ebook by id
router.get("/:id", getEbookById);

// Comments
router.get("/:id/comments", getEbookComments);
router.post("/:id/comments", addEbookComment);
router.put("/:ebookId/comments/:commentId", updateEbookComment);
router.delete("/:ebookId/comments/:commentId", deleteEbookComment);

// Create ebook
router.post("/", createEbook);

// Update ebook
router.put("/:id", updateEbook);

// Delete ebook
router.delete("/:id", deleteEbook);

export default router;
