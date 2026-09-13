import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Anyone can view comments
router.get("/:songId", getComments);

// Login required to create a comment
router.post("/:songId", authMiddleware, createComment);

// Login required + ownership checked inside controller
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;