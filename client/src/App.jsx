import { useEffect, useState } from "react";


function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }

        return response.json();
      })
      .then((data) => {
        setSongs(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1>Loading songs...</h1>;
  }

  if (error) {
    return <h1>Failed to load songs.</h1>;
  }

  if (songs.length === 0) {
    return <h1>No songs available.</h1>;
  }

  return (
    <div>
      <h1>Music Player</h1>

      {songs.map((song) => (
        <div key={song._id}>
          <img
            src={song.coverImage}
            alt={song.title}
            width="100"
          />

          <h2>{song.title}</h2>

          <p>{song.duration} seconds</p>
        </div>
      ))}
    </div>
  );
}

export default App;