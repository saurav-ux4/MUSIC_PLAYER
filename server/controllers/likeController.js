import Like from "../models/Like.js";

const likeSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const existingLike = await Like.findOne({
      user: req.user._id,
      song: songId,
    });

    if (existingLike) {
      return res.status(409).json({
        message: "Song already liked",
      });
    }

    const like = await Like.create({
      user: req.user._id,
      song: songId,
    });

    res.status(201).json(like);
  } catch (error) {
    console.error("Like song error:", error);

    res.status(500).json({
      message: "Failed to like song",
    });
  }
};

const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const like = await Like.findOneAndDelete({
      user: req.user._id,
      song: songId,
    });

    if (!like) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    res.status(200).json({
      message: "Song unliked",
    });
  } catch (error) {
    console.error("Unlike song error:", error);

    res.status(500).json({
      message: "Failed to unlike song",
    });
  }
};


const getLikeStatus = async (req, res) => {
  try {
    const { songId } = req.params;

    const like = await Like.findOne({
      user: req.user._id,
      song: songId,
    });

    res.status(200).json({
      liked: !!like,
    });
  } catch (error) {
    console.error("Get like status error:", error);

    res.status(500).json({
      message: "Failed to get like status",
    });
  }
};

export {
  likeSong,
  unlikeSong,
  getLikeStatus,
};