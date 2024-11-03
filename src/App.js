import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Playlist from "./Playlist";
import HomePage from "./HomePage";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import { useAppContext } from './AppContext';


function App() {
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
    truncateText
  } = useAppContext();

  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    getTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  }, []);

  useEffect(() => {
    if (triggerFetch) {
      getTracks();
      setTriggerFetch(false);
    }
  }, [triggerFetch]);


  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={function(){
            setKeyword("");
            setTriggerFetch(true);
          }}>
            <img
              src={`${process.env.PUBLIC_URL}/bajao_icon.png`}
              alt="Bajao Icon"
              width="40"
              height="40"
              className="me-2"
            />
            Bajao
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/playlist">Your Playlist</Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Bitrate
                </a>
                <ul className="dropdown-menu">
                  {/* Bitrate options */}
                  <li><button className="dropdown-item" onClick={() => handleBitrateChange(0)}>12kbps (fastest loading)</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBitrateChange(1)}>48kbps</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBitrateChange(2)}>96kbps</button></li>
                  <li><button className="dropdown-item" onClick={() => handleBitrateChange(4)}>320kbps (highest quality)</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={() => handleBitrateChange(3)}>160kbps (default)</button></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">
                  Download Music
                </a>
              </li>
            </ul>
            <form className="d-flex w-50" role="search" onSubmit={getTracks}>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="form-control me-2"
                type="search"
                placeholder="Search for songs by name, artists or language"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Music Player Widget */}
      <div className="music-player">
        <div className="player-info d-flex align-items-center">
          {nowPlaying ? (
            <>
              <img
                src={nowPlaying.image[1].link}
                alt="cover"
                className="player-img"
              />
              <div className="player-details">
                <h5>{nowPlaying.name}</h5>
                <p>{truncateText(nowPlaying.primaryArtists, 20)}</p>
              </div>
            </>
          ) : (
            <>
              <img
                src={`${process.env.PUBLIC_URL}/bajao_icon.png`}
                alt="cover"
                className="player-img"
              />
              <div className="player-details">
                <h5>Now Playing</h5>
                <p>Artist Name</p>
              </div>
            </>
          )}
        </div>
        <div className="player-controls">
          <audio ref={audioRef} autoPlay controls controlsList="nodownload">
            <source
              src={
                nowPlaying ? nowPlaying.downloadUrl[selectedBitrate].link : ""
              }
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
      

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>


      <footer className="text-center bg-dark text-light py-3">
        <p style={{ fontSize: "0.9rem", margin: 0 }}>
          This content is not affiliated with, endorsed, sponsored, or
          specifically approved by any third-party music provider like Gaana,
          Saavn, Spotify, and is not responsible for any copyright material.
          <br />
          We don't serve any music on our servers.
          <br />
          <strong>"Bajao"</strong> by Rushil Sethi
        </p>
      </footer>
    </Router>
  );
}

export default App;
