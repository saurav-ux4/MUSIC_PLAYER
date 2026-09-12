import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/songController.js";

const router = express.Router();

router.get("/", getSongs);

router.get("/:id", getSong);

router.post("/", authMiddleware, upload.single("audio"), createSong);

router.put("/:id", updateSong);

router.delete("/:id", deleteSong);

 export default router;