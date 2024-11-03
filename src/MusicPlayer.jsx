import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

const MusicPlayer = ({ currentIndex = 0, setCurrentIndex, audioRef }) => {
  const { favorites, nowPlaying, handlePlay, selectedBitrate } =
    useAppContext();
  const [playRandom, setPlayRandom] = useState(false);

  const handlePrevSong = () => {
    const newIndex =
      currentIndex === 0 ? favorites.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    // Check if the new index is valid
    if (favorites[newIndex]) {
      handlePlay(favorites[newIndex]);
    } else {
      console.error("Favorite track not found for index:", newIndex);
    }
  };

  const handleNextSong = () => {
    let newIndex;
    if (playRandom) {
      newIndex = Math.floor(Math.random() * favorites.length);
    } else {
      newIndex = (currentIndex + 1) % favorites.length;
    }
    setCurrentIndex(newIndex);
    handlePlay(favorites[newIndex]);
  };

  // automatically play next song based on playRandom Value
  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const handleEnded = () => {
        if (favorites.length > 0) {
          let newIndex;
          if (playRandom) {
            newIndex = Math.floor(Math.random() * favorites.length);
          } else {
            newIndex = (currentIndex + 1) % favorites.length;
          }
          setCurrentIndex(newIndex);
          handlePlay(favorites[newIndex]);
        }
      };
      audioElement.addEventListener("ended", handleEnded);
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef, favorites, currentIndex, playRandom]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-dark rounded shadow-lg"
      style={{ width: "50vw", height: "80vh", margin: "20px auto" }} // Set dimensions
    >
      <div className="text-center mt-4">
        {nowPlaying ? (
          <>
            <img
              src={nowPlaying.image[2].link}
              alt="cover"
              className={`img-fluid mb-3 spin`} // Apply spin class if playing
              style={{
                maxHeight: "250px",
                borderRadius: "50%",
                width: "250px",
                height: "250px",
              }} // Circular image
            />
            <h4 className="text-light font-weight-bold mb-1">
              {nowPlaying.name}
            </h4>
            <p className="text-muted mb-4">{nowPlaying.primaryArtists}</p>
          </>
        ) : (
          <>
            <img
              src="placeholder-image-url.jpg" // Placeholder image URL
              alt="placeholder cover"
              className="img-fluid mb-3"
              style={{
                maxHeight: "250px",
                borderRadius: "50%",
                width: "250px",
                height: "250px",
              }} // Circular image
            />
            <h4 className="text-light font-weight-bold mb-1">Song Name</h4>
            <p className="text-muted mb-4">Artist Name</p>
          </>
        )}

        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-secondary mx-2" onClick={handlePrevSong}>
            <FaStepBackward />
          </button>
          <button className="btn btn-secondary mx-2" onClick={handleNextSong}>
            <FaStepForward />
          </button>
          {/* add loop or random toggle button here */}
          <button
            className="btn btn-secondary mx-2"
            onClick={() => setPlayRandom(!playRandom)}
          >
            {playRandom ? "Switch to Loop" : "Switch to Random"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
