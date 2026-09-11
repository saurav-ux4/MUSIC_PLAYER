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
        
     .then(async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload song");
  }

  return data;
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
      <input
         type="file"
         accept="audio/mpeg"
         onChange={(event) => {
                 const file = event.target.files[0];

           if (!file) {
            return;
             }

             const audio = new Audio();

             audio.src = URL.createObjectURL(file);

             audio.addEventListener("loadedmetadata", () => {
             console.log("File:", file);
console.log("Duration:", audio.duration);

const formData = new FormData();

formData.append("title", file.name);
formData.append("audio", file);
formData.append("duration", audio.duration);

console.log(formData.get("title"));
console.log(formData.get("audio"));
console.log(formData.get("duration"));

const title = file.name.replace(".mp3", "");

fetch(
  `https://itunes.apple.com/search?term=${encodeURIComponent(
    title
  )}&entity=song&limit=1`
)
  .then((response) => response.json())
  .then((data) => {
        const artworkUrl = data.results[0]?.artworkUrl100;

          console.log("Artwork URL:", artworkUrl);

           const finalCoverImage =
  artworkUrl || "https://placehold.co/600x600?text=Music";

formData.append("coverImage", finalCoverImage);

console.log("Cover image:", formData.get("coverImage"));

    fetch("http://localhost:5000/api/songs", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload song");
        }

        return response.json();
      })
      .then((song) => {
        console.log("Song uploaded:", song);
          setSongs((previousSongs) => [song, ...previousSongs]);
          setCurrentSong(song);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  })
  .catch((error) => {
    console.error("Artwork search failed:", error);
  });

URL.revokeObjectURL(audio.src);
          });
            }}
      />


      
       
        {songs.length === 0 ? (
        <h2>No songs available.</h2>
      ) : (
        <>
          <SongList
            songs={songs}
            onSelect={handleSelectSong}
          />

          <MusicPlayer
            song={currentSong}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onRandom={handleRandom}
          />
        </>
      )}
    </div>
  );
}

export default App;