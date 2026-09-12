import { useRef, useState } from "react";
import SongCard from "./SongCard";

function SongList({ songs, currentSong, onSelect, isOpen, onOpenChange, onUploadClick }) {
  const sheetRef = useRef(null);
  const dragState = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event) => {
    dragState.current = {
      startY: event.clientY,
      sheetHeight: sheetRef.current.offsetHeight,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragState.current) {
      return;
    }

    const delta = event.clientY - dragState.current.startY;
    setDragOffset(Math.max(0, delta));
  };

  const handlePointerUp = () => {
    if (!dragState.current) {
      return;
    }

    const { sheetHeight } = dragState.current;
    const shouldClose = dragOffset > sheetHeight * 0.25;

    setIsDragging(false);
    setDragOffset(0);
    dragState.current = null;

    if (shouldClose) {
      onOpenChange(false);
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`song-sheet ${isDragging ? "dragging" : ""}`}
      style={isDragging ? { transform: `translateY(${dragOffset}px)` } : undefined}
    >
      <div
        className="song-sheet-handle"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className="song-list-header">
        <button className="icon-button ghost small" onClick={() => onOpenChange(false)} aria-label="Close">
          <ChevronLeftIcon />
        </button>
        <h1>Songs</h1>
        <button className="icon-button ghost small" onClick={onUploadClick} aria-label="Add song">
          <PlusIcon />
        </button>
      </div>

      <div className="song-list">
        {songs.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            onSelect={onSelect}
            isCurrent={currentSong?._id === song._id}
          />
        ))}
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

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default SongList;