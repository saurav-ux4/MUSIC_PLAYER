import { useEffect, useState } from "react";

function Comments({ song }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comments/${song._id}`
        );

        const data = await response.json();

        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [song]);

  if (!song) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${song._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to post comment");
        return;
      }

      setComments((currentComments) => [data, ...currentComments]);
      setText("");
    } catch (error) {
      console.error("Post comment error:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete comment");
        return;
      }

      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  return (
    <div className="comments-panel">
      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div className="comment-item" key={comment._id}>
              <div className="comment-item-body">
                <strong>{comment.user?.name || "unknown user"}</strong>
                <p>{comment.text}</p>
              </div>

              <button
                className="icon-button ghost small"
                onClick={() => handleDelete(comment._id)}
                aria-label="Delete comment"
              >
                <TrashIcon />
              </button>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="comment here..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button type="submit" className="comment-send" aria-label="Send">
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

export default Comments;