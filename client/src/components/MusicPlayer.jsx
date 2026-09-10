import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function MusicPlayer({ song,onNext , onPrevious }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!song) {
      return;
    }

    audioRef.current.load();
     audioRef.current
    .play()
    .then(() => {
      setIsPlaying(true);
    })
    .catch(() => {
      setIsPlaying(false);
    });
}, [song]);
   

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!song) {
    return <p>No song selected.</p>;
  }

  return (
    <div>
      <img src={song.coverImage} alt={song.title} width="100" />

      <h2>{song.title}</h2>

      <audio ref={audioRef} src={song.audioUrl}
                onTimeUpdate={(event) => setCurrentTime(event.target.currentTime)}
                onLoadedMetadata={(event) => setDuration(event.target.duration)}
                 onEnded={onNext} />

      <p>
         {formatTime(currentTime)}/ {formatTime(duration)}
     </p>

     <input
  type="range"
  min="0"
  max={duration}
  value={currentTime}
  onChange={(event) => {
    audioRef.current.currentTime = event.target.value;
  }}
/>

      <button onClick={onPrevious}>
          Previous
      </button>
 
      <button onClick={handlePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button onClick={onNext}>
         Next
      </button>

      
    </div>
  );
}

export default MusicPlayer;