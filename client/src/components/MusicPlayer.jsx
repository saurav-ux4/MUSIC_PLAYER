import { useEffect, useRef, useState } from "react";
import Comments from "./Comments";
import LikedSongs from "./LikedSongs";
import AccountPanel from "./AccountPanel";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function MusicPlayer({
  song,
  onNext,
  onPrevious,
  onRandom,
  onOpenSheet,
  onAddSong,
  onSelectSong,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const dragState = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLikedListOpen, setIsLikedListOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    if (!song) {
      return;
    }

    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }, [song]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token || !song) {
        setLiked(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/likes/${song._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to get like status");
        }

        setLiked(data.liked);
      } catch (error) {
        console.error("Failed to get like status:", error);
        setLiked(false);
      }
    };

    checkLikeStatus();
  }, [song]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!song) {
    return (
      <div className="player-status">
        <p>No song selected.</p>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?song=${song._id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error("Copy link failed:", error);
      alert("Could not copy the song link.");
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const isInteractiveTarget = (event) =>
    event.target.closest("button, input, a");

  const handleSwipeStart = (event) => {
    if (isInteractiveTarget(event)) {
      return;
    }

    dragState.current = { startY: event.clientY };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSwipeMove = (event) => {
    if (!dragState.current) {
      return;
    }

    const delta = dragState.current.startY - event.clientY;
    setDragOffset(Math.max(0, delta));
  };

  const handleSwipeEnd = () => {
    if (!dragState.current) {
      return;
    }

    const shouldOpen = dragOffset > 60;

    setIsDragging(false);
    setDragOffset(0);
    dragState.current = null;

    if (shouldOpen) {
      onOpenSheet();
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to like songs.");
      return;
    }

    try {
      const method = liked ? "DELETE" : "POST";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/likes/${song._id}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Like action failed");
      }

      setLiked(!liked);
    } catch (error) {
      console.error("Like action failed:", error);
    }
  };

  const handleLikePointerDown = () => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setIsLikedListOpen(true);
    }, 500);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleLikeClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    handleLike();
  };

  return (
    <div
      className="now-playing"
      onPointerDown={handleSwipeStart}
      onPointerMove={handleSwipeMove}
      onPointerUp={handleSwipeEnd}
      onPointerCancel={handleSwipeEnd}
      style={isDragging ? { transform: `translateY(-${dragOffset}px)` } : undefined}
    >
      <div className="now-playing-header">
        {isCommentsOpen ? (
          <button
            className="icon-button ghost small"
            onClick={() => setIsCommentsOpen(false)}
            aria-label="Back"
          >
            <ChevronLeftIcon />
          </button>
        ) : (
          <button
            className="icon-button ghost small"
            onClick={() => setIsAccountOpen(true)}
            aria-label="Account"
          >
            <UserIcon />
          </button>
        )}

        <h1>Now Playing</h1>

        {isCommentsOpen ? (
          <button
            className="icon-button ghost small"
            onClick={onAddSong}
            aria-label="Add"
          >
            <PlusIcon />
          </button>
        ) : (
          <span className="header-spacer" />
        )}
      </div>

      {/* Audio must stay mounted at all times — otherwise switching to the
          comments view would unmount it and stop playback mid-song. */}
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={(event) => setCurrentTime(event.target.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.target.duration)}
        onEnded={onNext}
      />

      {isCommentsOpen ? (
        <Comments song={song} />
      ) : (
        <>
          <div className="now-playing-art">
            <img src={song.coverImage} alt={song.title} />
          </div>

          <div className="now-playing-meta">
            <h2>{song.title}</h2>
            {song.artist && <p>{song.artist}</p>}

            <button className="upload-trigger" onClick={handleShare}>
              Share
            </button>
          </div>

          <div className="now-playing-progress">
            <input
              className="seek"
              style={{ "--progress": `${progress}%` }}
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(event) => {
                audioRef.current.currentTime = event.target.value;
              }}
            />

            <div className="now-playing-time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="now-playing-engagement">
            <button
              className={`icon-button secondary ${liked ? "liked" : ""}`}
              onPointerDown={handleLikePointerDown}
              onPointerUp={clearLongPress}
              onPointerLeave={clearLongPress}
              onClick={handleLikeClick}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <ThumbIcon filled={liked} />
            </button>

            <button
              className="icon-button secondary"
              onClick={() => setIsCommentsOpen(true)}
              aria-label="Comments"
            >
              <CommentIcon />
            </button>
          </div>
        </>
      )}

      <div className="now-playing-controls">
        <button className="icon-button ghost" onClick={onRandom} aria-label="Shuffle">
          <ShuffleIcon />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <button className="icon-button secondary" onClick={onPrevious} aria-label="Previous">
            <PreviousIcon />
          </button>

          <button
            className="icon-button primary"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button className="icon-button secondary" onClick={onNext} aria-label="Next">
            <NextIcon />
          </button>
        </div>

        <button className="icon-button ghost" onClick={onAddSong} aria-label="Add">
          <PlusIcon />
        </button>
      </div>

      <button className="swipe-hint" onClick={onOpenSheet} aria-label="Show songs">
        <ChevronUpIcon />
      </button>

      <LikedSongs
        open={isLikedListOpen}
        currentSong={song}
        onClose={() => setIsLikedListOpen(false)}
        onSelect={(selectedSong) => {
          onSelectSong(selectedSong);
          setIsLikedListOpen(false);
        }}
      />

      <AccountPanel
        open={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5v14l9-7z" />
      <rect x="16" y="5" width="2.5" height="14" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 5v14l-9-7z" />
      <rect x="5.5" y="5" width="2.5" height="14" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ThumbIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 17 11h-4.5l.9-4.5A1.5 1.5 0 0 0 12 5L7 11" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  );
}

export default MusicPlayer;