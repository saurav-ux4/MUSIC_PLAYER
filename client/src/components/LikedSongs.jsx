import { useEffect, useState } from "react";

function LikedSongs({ open, currentSong, onClose, onSelect }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchLikedSongs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setSongs([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch liked songs");
        }

        setSongs(data);
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [open]);

  const handleUnlike = async (event, songId) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/likes/${songId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setSongs((currentSongs) =>
        currentSongs.filter((song) => song._id !== songId)
      );
    } catch (error) {
      console.error("Unlike failed:", error);
    }
  };

  return (
    <div className={`overlay-sheet ${open ? "open" : ""}`}>
      <div className="song-list-header">
        <button className="icon-button ghost small" onClick={onClose} aria-label="Close">
          <ChevronLeftIcon />
        </button>
        <h1>Liked Songs</h1>
        <span className="header-spacer" />
      </div>

      <div className="song-list">
        {loading ? (
          <p className="comments-empty">Loading...</p>
        ) : songs.length === 0 ? (
          <p className="comments-empty">No liked songs yet.</p>
        ) : (
          songs.map((song) => (
            <div
              key={song._id}
              className={`song-card ${currentSong?._id === song._id ? "song-card-current" : ""}`}
              onClick={() => onSelect(song)}
            >
              <img className="song-card-art" src={song.coverImage} alt={song.title} />

              <div className="song-card-meta">
                <h3>{song.title}</h3>
                <p>{song.duration} sec</p>
              </div>

              <button
                className="icon-button ghost small"
                onClick={(event) => handleUnlike(event, song._id)}
                aria-label="Unlike"
              >
                <HeartIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.7-4.35-9.33-8.2C.6 9.77 1.5 6 4.9 4.75 7.2 3.9 9.6 4.85 12 7.5c2.4-2.65 4.8-3.6 7.1-2.75C22.5 6 23.4 9.77 21.33 12.8 18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export default LikedSongs;