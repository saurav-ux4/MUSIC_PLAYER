function SongCard({ song }) {
  return (
    <div>
      <img src={song.coverImage} alt={song.title} width="100" />
      <h2>{song.title}</h2>
      <p>{song.duration} seconds</p>
    </div>
  );
}

export default SongCard;