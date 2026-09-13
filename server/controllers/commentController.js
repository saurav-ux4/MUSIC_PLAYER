import Comment from "../models/Comment.js";

const getComments = async (req, res) => {
  try {
    const { songId } = req.params;

    const comments = await Comment.find({ song: songId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Failed to get comments",
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { songId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      user: req.user._id,
      song: songId,
    });

    const populatedComment = await comment.populate(
      "user",
      "name profileImage"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

  

    const comment = await Comment.findById(commentId);



    if (!comment) {
      return res.status(404).json({
        message: "Comment does not exist",
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You do not own this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment deleted",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};

export {
  getComments,
  createComment,
  deleteComment,
};