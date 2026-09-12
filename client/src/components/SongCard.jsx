function SongCard({ song, onSelect, isCurrent }) {
  return (
    <div
      className={`song-card ${isCurrent ? "song-card-current" : ""}`}
      onClick={() => onSelect(song)}
    >
      <img className="song-card-art" src={song.coverImage} alt={song.title} />

      <div className="song-card-meta">
        <h3>{song.title}</h3>
        <p>{song.duration} sec</p>
      </div>

      {isCurrent && (
        <span className="icon-button ghost small" aria-hidden="true">
          <PlayingIcon />
        </span>
      )}
    </div>
  );
}

function PlayingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="10" width="3" height="6" />
      <rect x="10.5" y="4" width="3" height="16" />
      <rect x="17" y="8" width="3" height="10" />
    </svg>
  );
}

export default SongCard;