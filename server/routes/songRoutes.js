const express = require("express");

const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
} = require("../controllers/songController");

const router = express.Router();

router.get("/", getSongs);

router.get("/:id", getSong);

router.post("/", createSong);

router.put("/:id", updateSong);

router.delete("/:id", deleteSong);

module.exports = router;