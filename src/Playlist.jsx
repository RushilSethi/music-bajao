import React, { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import MusicPlayer from "./MusicPlayer";

const PlaylistPage = () => {
  const {
    keyword,
    setKeyword,
    tracks,
    setTracks,
    loading,
    setLoading,
    error,
    setError,
    selectedBitrate,
    nowPlaying,
    getTracks,
    handleBitrateChange,
    handlePlay,
    audioRef,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState("list");
  const [currentFavIndex, setCurrentFavIndex] = useState(undefined);

  const renderTrackList = () => (
    <div
      className="track-list mt-4"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      {favorites.length === 0 ? (
        <div className="text-center text-secondary mt-5">
          Add songs from the home page to access here
        </div>
      ) : (
        favorites.map((track, index) => (
          <div
            key={index}
            className="card my-3"
            style={{ width: "100%", maxWidth: "540px", cursor: "pointer" }}
            onClick={function(){
              handlePlay(track);
              setCurrentFavIndex(index);
            }}
          >
            <div className="row g-0 h-100">
              <div className="col-4">
                <img
                  src={track.image[2].link}
                  className="img-fluid w-100 h-100" 
                  alt={track.name}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="col-8 d-flex flex-column justify-content-center">
                <div className="card-body">
                  <h5 className="card-title">{track.name}</h5>
                  <p className="card-text">{track.primaryArtists}</p>
                  <p className="card-text">
                    <small className="text-secondary">
                      Duration: {track.duration} seconds
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
  

  const renderMusicPlayer = () => <MusicPlayer currentIndex={currentFavIndex} setCurrentIndex={setCurrentFavIndex} audioRef={audioRef}/>;

  return (
    <div className="container-fluid playlist-page">
      {/* For larger screens */}
      <div className="d-none d-md-flex">
        <div className="col-md-4 offset-md-1">{renderTrackList()}</div>
        <div className="col-md-4">{renderMusicPlayer()}</div>
      </div>

      {/* Tabs for smaller screens */}
      <div className="d-md-none">
        <ul className="nav nav-underline justify-content-center">
          <li className="nav-item flex-fill">
            <button
              className={`text-center w-100 nav-link ${
                activeTab === "list" ? "custom-active" : ""
              }`}
              onClick={() => setActiveTab("list")}
            >
              Songs
            </button>
          </li>
          <li className="nav-item flex-fill">
            <button
              className={`text-center w-100 nav-link ${
                activeTab === "player" ? "custom-active" : ""
              }`}
              onClick={() => setActiveTab("player")}
            >
              Player
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === "list" && <div>{renderTrackList()}</div>}
          {activeTab === "player" && <div>{renderMusicPlayer()}</div>}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
