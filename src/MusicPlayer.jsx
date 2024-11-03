import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
} from "react-icons/fa";

const MusicPlayer = ({ currentIndex = 0, setCurrentIndex, audioRef }) => {
  const { favorites, nowPlaying, handlePlay, selectedBitrate, truncateText } =
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
      className="bg-dark rounded shadow-lg p-4 d-flex flex-column justify-content-center"
      style={{
        height: "100%",
        minHeight: "350px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div className="d-flex align-items-center mb-4">
        <div className="vinyl-container">
          <img
            src={
              nowPlaying
                ? nowPlaying.image[2].link
                : `${process.env.PUBLIC_URL}/bajao_icon.png`
            }
            alt="cover"
            className="vinyl-album"
          />
        </div>
        <div className="text-center" style={{ marginLeft: "20px" }}>
          <h3 className="text-light font-weight-bold mb-1">
            {nowPlaying ? nowPlaying.name : "Song Name"}
          </h3>
          <p className="text-secondary mb-0" style={{ fontSize: "1.2em" }}>
            {nowPlaying
              ? truncateText(nowPlaying.primaryArtists, 20)
              : "Artist Name"}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-outline-light mx-2 p-3"
          style={{
            fontSize: "1.5em",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onClick={handlePrevSong}
        >
          <FaStepBackward />
        </button>
        <button
          className="btn btn-outline-light mx-2 p-3"
          style={{
            fontSize: "1.5em",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onClick={handleNextSong}
        >
          <FaStepForward />
        </button>
      </div>

      <button
        title={playRandom ? "Switch to play in order" : "Switch to shuffle play"}
        className="btn btn-outline-light mx-2 d-flex align-items-center justify-content-center"
        style={{ width: "100%", fontSize: "1.2em" }}
        onClick={() => setPlayRandom(!playRandom)}
      >
        {playRandom ? (
          <>
            <FaRedo className="me-2" />
            Playing Songs Randomly
          </>
        ) : (
          <>
            <FaRandom className="me-2" />
            Playing Songs in Order
          </>
        )}
      </button>

      <hr
        className="my-4"
        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
      />
      <p className="text-secondary text-center" style={{ fontSize: "0.9em" }}>
        Note: Autoplay is only supported by songs you have added to your
        playlist.
      </p>
    </div>
  );
};

export default MusicPlayer;
