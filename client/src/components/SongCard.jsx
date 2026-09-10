function SongCard({ song, onSelect }) {
  return (
    <div className="song-card" onClick={() => onSelect(song)}>
      <img src={song.coverImage} alt={song.title} />

      <h2>{song.title}</h2>

      <p>{song.duration} seconds</p>
    </div>
  );
}

export default SongCard;