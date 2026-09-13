import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  likeSong,
  unlikeSong,
  getLikeStatus,
} from "../controllers/likeController.js";

const router = express.Router();

router.get("/:songId", authMiddleware, getLikeStatus);

router.post("/:songId", authMiddleware, likeSong);

router.delete("/:songId", authMiddleware, unlikeSong);

export default router;