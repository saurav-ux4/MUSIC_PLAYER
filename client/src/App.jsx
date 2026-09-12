import { useEffect, useRef, useState } from "react";
import "./App.css";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";
import GoogleLoginButton from "./components/GoogleLoginButton.jsx";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/songs`)
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

           const sharedSongId = new URLSearchParams(window.location.search).get("song");

           const sharedSong = data.find(
           (song) => song._id === sharedSongId
            );

          setCurrentSong(sharedSong ||data[0]);
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
    setIsSheetOpen(false);
  };

  if (loading) {
    return (
      <div className="player-status">
        <h1>Loading songs...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-status">
        <h1>Failed to load songs.</h1>
      </div>
    );
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

  const handleFileChange = (event) => {
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

         const token = localStorage.getItem("token");

fetch(`${import.meta.env.VITE_API_URL}/api/songs`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
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
  };

  return (

   
    <div className={`player-app ${isSheetOpen ? "sheet-open" : ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

       <GoogleLoginButton />

      {songs.length === 0 ? (
        <div className="player-status">
          <h1>No songs available.</h1>
          <button
            className="upload-trigger"
            onClick={() => fileInputRef.current.click()}
          >
            Upload a song
          </button>
        </div>
      ) : (
        <>
          <MusicPlayer
            song={currentSong}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onRandom={handleRandom}
            onOpenSheet={() => setIsSheetOpen(true)}
             onAddSong={() => fileInputRef.current.click()}
          />

          <SongList
            songs={songs}
            currentSong={currentSong}
            onSelect={handleSelectSong}
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            onUploadClick={() => fileInputRef.current.click()}
          />
        </>
      )}
    </div>
  
  );
}

export default App;