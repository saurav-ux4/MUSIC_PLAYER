import SongCard from "./SongCard";

function SongList({ songs, onSelect }) {
  return (
    <div className="song-list">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default SongList;