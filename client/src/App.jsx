import { useEffect, useState } from "react";
import "./App.css";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";



function App() {
  const [songs, setSongs] = useState([]);
   const [currentSong, setCurrentSong] = useState(null);
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

        if (data.length > 0) {
          setCurrentSong(data[0]);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  if (loading) {
    return <h1>Loading songs...</h1>;
  }

  if (error) {
    return <h1>Failed to load songs.</h1>;
  }

  if (songs.length === 0) {
    return <h1>No songs available.</h1>;
  }

  const handleNext = () => {
  const currentIndex = songs.findIndex(
    (song) => song._id === currentSong?._id
  );

  if (currentIndex < songs.length - 1) {
    setCurrentSong(songs[currentIndex + 1]);
  }
};

const handlePrevious = () => {
  const currentIndex = songs.findIndex(
    (song) => song._id === currentSong?._id
  );

  if (currentIndex > 0) {
    setCurrentSong(songs[currentIndex - 1]);
  }
};

const handleRandom = () => {
  if (songs.length <= 1) {
    return;
  }

  const currentIndex = songs.findIndex(
    (song) => song._id === currentSong?._id
  );

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentIndex);

  setCurrentSong(songs[randomIndex]);
};

  return (
    <div className="app">
      <h1>Music Player</h1>
     <SongList songs={songs} onSelect={handleSelectSong}/>
      <MusicPlayer song={currentSong}  onNext={handleNext}   onPrevious={handlePrevious}  onRandom={handleRandom} />
    </div>
  );
}

export default App;