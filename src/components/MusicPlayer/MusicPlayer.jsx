import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/PlayerContext";
import {
  FaChevronUp,
  FaChevronDown,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
  FaHeart
} from "react-icons/fa";
// import "./MusicPlayer.css";

const MusicPlayer = () => {
  const {
    nowPlaying,
    audioRef,
    selectedBitrate,
    truncateText,
    playRandom,
    setPlayRandom,
    playSource = "favorites",
    favorites,
    addFavorite,
    handlePlay,
    queue,
    setQueue,
    fetchArtistBasedRecommendations,
    showToast,
    decodeHtmlEntities,
  } = useAppContext();

  const [expanded, setExpanded] = useState(false);
  const [isFetchingRecs, setIsFetchingRecs] = useState(false);

  const favIndex = favorites.findIndex((track) => track.id === nowPlaying?.id);

  // ▶️ Prev / Next for favorites only
  // 🔙 Prev Song
  const handlePrevSong = () => {
    if (!nowPlaying) return;

    if (playSource === "favorites") {
      if (favorites.length === 0) return;
      const newIndex = favIndex === 0 ? favorites.length - 1 : favIndex - 1;
      handlePlay(favorites[newIndex], "favorites");
    }

    if (playSource === "home") {
      const currentIndex = queue.findIndex((t) => t.id === nowPlaying.id);
      if (currentIndex <= 0) return; // No previous track
      const prevTrack = queue[currentIndex - 1];
      if (prevTrack) handlePlay(prevTrack, "home");
    }
  };

  // ⏭️ Next Song
  const handleNextSong = () => {
    if (!nowPlaying) return;

    if (playSource === "favorites") {
      if (favorites.length === 0) return;
      const newIndex = playRandom
        ? Math.floor(Math.random() * favorites.length)
        : (favIndex + 1) % favorites.length;
      handlePlay(favorites[newIndex], "favorites");
    }

    if (playSource === "home") {
      const currentIndex = queue.findIndex((t) => t.id === nowPlaying.id);
      const isLast = currentIndex === queue.length - 1;

      if (isLast) {
        console.log("End of home queue, fetching recs...");
        fetchArtistBasedRecommendations(queue);
      }

      const nextTrack = queue[currentIndex + 1];
      if (nextTrack) handlePlay(nextTrack, "home");
    }
  };

  useEffect(() => {
    if (!nowPlaying || playSource !== "home") return;
    const currentIndex = queue.findIndex((t) => t.id === nowPlaying.id);
    const isLast = currentIndex === queue.length - 1;

    if (isLast && !isFetchingRecs) {
      console.log("⏩ Last song started, fetching recs...");
      setIsFetchingRecs(true);
      fetchArtistBasedRecommendations(queue).finally(() =>
        setIsFetchingRecs(false)
      ); // reset once fetched
    }
  }, [nowPlaying, playSource, queue]);

  // 🎵 Handle autoplay when song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying) return;

    const handleEnded = () => {
      if (playSource === "favorites") {
        // ✅ Only play within favorites
        if (favorites.length === 0) return;
        const nextIndex = playRandom
          ? Math.floor(Math.random() * favorites.length)
          : (favIndex + 1) % favorites.length;
        handlePlay(favorites[nextIndex], "favorites");
        return;
      }

      if (playSource === "home") {
        // ✅ Continue through queue
        const currentIndex = queue.findIndex(
          (track) => track.id === nowPlaying.id
        );
        const isLast = currentIndex === queue.length - 1;

        if (isLast) {
          console.log("End of home queue, fetching AI recs...");
          fetchArtistBasedRecommendations(queue);
        }

        const nextTrack = queue[currentIndex + 1];
        if (nextTrack) {
          handlePlay(nextTrack, "home");
        }
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [queue, nowPlaying, playSource, favorites, favIndex, playRandom]);

  // ⏱️ Mark song as listened
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying) return;

    // 🔹 If it's the very first song in the queue, mark it as listened immediately
    setQueue((prevQueue) => {
      const alreadyListened = prevQueue.some((t) => t.listenedTo);
      if (!alreadyListened) {
        return prevQueue.map((track) =>
          track.id === nowPlaying.id ? { ...track, listenedTo: true } : track
        );
      }
      return prevQueue;
    });

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const duration = Number(nowPlaying.duration);

      const isListened = currentTime >= 60 || currentTime >= 0.35 * duration;

      if (isListened) {
        setQueue((prevQueue) =>
          prevQueue.map((track) =>
            track.id === nowPlaying.id ? { ...track, listenedTo: true } : track
          )
        );
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [nowPlaying]);

  return (
    <div
      className={`music-player ${expanded ? "expanded" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        // e.preventDefault();
      }}
    >
      {expanded && (
        <div className="player-expanded mt-2">
          <div className="d-flex align-items-center mb-2">
            <div className="vinyl-container">
              <img
                src={
                  nowPlaying
                    ? nowPlaying.image[2].link
                    : `${import.meta.env.BASE_URL}bajao_icon.png`
                }
                alt="cover"
                className="vinyl-album"
              />
            </div>
            <div className="text-center" style={{ marginLeft: "20px" }}>
              <h3 className="text-light font-weight-bold mb-1">
                {nowPlaying ? decodeHtmlEntities(nowPlaying.name) : "Song Name"}
              </h3>
              <p className="text-secondary mb-0" style={{ fontSize: "1.2em" }}>
                {nowPlaying
                  ? truncateText(
                      decodeHtmlEntities(nowPlaying.primaryArtists),
                      20
                    )
                  : "Artist Name"}
              </p>
            </div>
          </div>
          <div
            className="d-flex justify-content-between
           mb-3"
          >
            <div className="">
              <button
                className={`btn btn-outline-light mx-2 p-2 ${
                  playSource === "home" &&
                  (!nowPlaying ||
                    queue.findIndex((t) => t.id === nowPlaying.id) <= 0)
                    ? "disabled opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  if (
                    playSource === "home" &&
                    (!nowPlaying ||
                      queue.findIndex((t) => t.id === nowPlaying.id) <= 0)
                  ) {
                    return; // Prevent clicking when disabled
                  }
                  handlePrevSong();
                }}
              >
                <FaStepBackward />
              </button>

              <button
                className={`btn mx-2 p-2 ${
                  isFetchingRecs ? "btn-secondary" : "btn-outline-light"
                }`}
                onClick={handleNextSong}
                disabled={isFetchingRecs}
              >
                <FaStepForward />
              </button>
            </div>
            <button
              className="btn btn-outline-danger mx-2 p-2"
              onClick={() => {
                if (nowPlaying) {
                  addFavorite(nowPlaying);
                }
              }}
            >
              <FaHeart />
            </button>
          </div>
          <button
            title={
              playSource === "favorites"
                ? playRandom
                  ? "Switch to order play"
                  : "Switch to random play"
                : "Disabled in Home mode"
            }
            className={`btn d-flex align-items-center justify-content-center w-100 ${
              playSource === "favorites" ? "btn-outline-light" : "btn-secondary"
            }`}
            style={{
              fontSize: "1em",
              cursor: playSource === "favorites" ? "pointer" : "not-allowed",
              opacity: playSource === "favorites" ? 1 : 0.6,
            }}
            onClick={() => {
              if (playSource === "favorites") {
                setPlayRandom(!playRandom);
              } else {
                showToast(
                  "This option works only when playing from Favorites."
                );
              }
            }}
          >
            {playRandom && playSource === "favorites" ? (
              <>
                <FaRandom className="me-2" /> Playing Songs Randomly
              </>
            ) : (
              <>
                <FaRedo className="me-2" /> Playing Songs in Order
              </>
            )}
          </button>
        </div>
      )}
      <div className="player-info d-flex align-items-center">
        {!expanded &&
          (nowPlaying ? (
            <>
              <img
                src={nowPlaying.image[1].link}
                alt="cover"
                className="player-img"
              />
              <div className="player-details">
                <h5>{decodeHtmlEntities(nowPlaying.name)}</h5>
                <p>
                  {truncateText(
                    decodeHtmlEntities(nowPlaying.primaryArtists),
                    20
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <img src="/bajao_icon.png" alt="cover" className="player-img" />
              <div className="player-details">
                <h5>Now Playing</h5>
                <p>Artist Name</p>
              </div>
            </>
          ))}
        <button
          className="btn btn-outline-light ms-auto mt-2"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>

      <div className="player-controls mt-2">
        <audio ref={audioRef} autoPlay controls controlsList="nodownload">
          <source
            src={
              nowPlaying ? nowPlaying.downloadUrl[selectedBitrate]?.link : ""
            }
          />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default MusicPlayer;
