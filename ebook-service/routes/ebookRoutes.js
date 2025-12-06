import express from "express";
import { createEbook, getEbooks, getEbookById } from "../controllers/ebookController.js";

const router = express.Router();

router.get("/", getEbooks);
router.get("/:id", getEbookById);
router.post("/", createEbook);

export default router;
