import SongCard from "./SongCard";

function SongList({ songs }) {
  return (
    <div className="song-list">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} />
      ))}
    </div>
  );
}

export default SongList;