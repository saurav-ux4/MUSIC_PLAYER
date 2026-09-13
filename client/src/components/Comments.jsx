import { useEffect, useState } from "react";

function Comments({song}) {
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
        body: JSON.stringify({
          text,
        }),
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
    <section className="comments">
      <h2>Comments</h2>

      <form className="comment-form"  onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button type="submit">
          Post
        </button>
      </form>

      <div className="comment-list">
  {comments.length === 0 ? (
    <p className="comments-empty">
      No comments yet.
    </p>
  ) : (
    comments.map((comment) => (
      <div className="comment" key={comment._id}>
        <strong>{comment.user.name || "unknown user"}</strong>
        <p>{comment.text}</p>

         <button onClick={() => handleDelete(comment._id)}>
          Delete
        </button>
      </div>
    ))
  )}
</div>



    </section>
  );
}

export default Comments;