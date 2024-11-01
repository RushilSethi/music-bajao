import "./App.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Playlist from "./Playlist";

function App() {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState(3);
  const [nowPlaying, setNowPlaying] = useState(null);
  const audioRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");


  const tags = [
    "Hindi",
    "English Songs",
    "Punjabi Hits",
    "Bollywood Hits",
    "Old Songs",
    "Workout Mix",
    "Arijit Singh",
    "KK",
    "Neha Kakkar",
    "Badshah",
    "Atif Aslam",
    "Guru Randhawa",
    "Shreya Ghoshal",
    "Harrdy Sandhu",
    "Darshan Raval",
    "Diljit Dosanjh",
    "Armaan Malik",
    "Karan Aujla",
    "Yo Yo Honey Singh",
    "Billie Eilish",
    "Justin Bieber",
    "Imagine Dragons",
    "Ed Sheeran",
    "Taylor Swift",
    "Sia",
    "The Weeknd",
    "Rihanna",
    "One Direction",
    "Michael Jackson",
    "Charlie Puth",
    "The Chainsmokers",
    "Shawn Mendes",
  ];

  const hindiTags = [
    "Hindi", "Bollywood Hits", "Arijit Singh", "KK", "Neha Kakkar", "Badshah",
    "Atif Aslam", "Shreya Ghoshal", "Harrdy Sandhu", "Darshan Raval",
    "Armaan Malik", "Old Songs", "Workout Mix"
  ];
  
  const englishTags = [
    "English Songs", "Billie Eilish", "Justin Bieber", "Imagine Dragons",
    "Ed Sheeran", "Taylor Swift", "Sia", "The Weeknd", "Rihanna",
    "One Direction", "Michael Jackson", "Charlie Puth", "The Chainsmokers",
    "Shawn Mendes", "Workout Mix"
  ];
  
  const punjabiTags = [
    "Punjabi Hits", "Diljit Dosanjh", "Guru Randhawa", "Karan Aujla", "Yo Yo Honey Singh",
    "Harrdy Sandhu", "Workout Mix"
  ];

  const tagsToDisplay = selectedLanguage === "Hindi"
    ? hindiTags
    : selectedLanguage === "English"
    ? englishTags
    : punjabiTags;

  async function getTracks(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let data = await fetch(
        `${process.env.REACT_APP_API_URL}/search/songs?query=${
          keyword === "" ? "hindi" : keyword
        }&limit=40`
      );
      
      if (!data.ok) throw new Error("Network response was not ok");
      let convertedData = await data.json();
      setTracks(convertedData.data.results);
    } catch (error) {
      setError(
        "Error fetching data. Try to reload the page or try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  }, []);

  const handleBitrateChange = (index) => {
    setSelectedBitrate(index);
    if (nowPlaying) {
      audioRef.current.src = nowPlaying.downloadUrl[index].link;
      audioRef.current.play();
    }
  };

  const handlePlay = (track) => {
    setNowPlaying(track);
    if (audioRef.current) {
      audioRef.current.src = track.downloadUrl[selectedBitrate].link;
      audioRef.current.play();
    }
  };

  async function getTracksByTag(tag) {
    setLoading(true);
    setError(null);
    setKeyword(tag);
    try {
      let data = await fetch(
        `${process.env.REACT_APP_API_URL}/search/songs?query=${tag}&limit=40`
      );
      if (!data.ok) throw new Error("Network response was not ok");
      let convertedData = await data.json();
      setTracks(convertedData.data.results);
    } catch (error) {
      setError("Error fetching data. Try to reload the page or try again later.");
    } finally {
      setLoading(false);
    }
  }
  

  const handleTagClick = (event, tag) => {
    if (event) event.preventDefault();
    getTracksByTag(tag);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={`${process.env.PUBLIC_URL}/bajao_icon.png`}
              alt="Bajao Icon"
              width="40"
              height="40"
              className="me-2"
            />
            Bajao
          </a>
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
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"> Your Playlist</a>
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
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBitrateChange(0)}
                    >
                      12kbps (fastest loading)
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBitrateChange(1)}
                    >
                      48kbps
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBitrateChange(2)}
                    >
                      96kbps
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBitrateChange(4)}
                    >
                      320kbps (highest quality)
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleBitrateChange(3)}
                    >
                      160kbps (default)
                    </button>
                  </li>
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

      {/* Tag section below the search bar */}
      <div className="container my-2">
      {/* Dropdown only for Small Screens */}
      <div className="d-sm-none d-block mb-3 dropdown">
        <button
          className="btn btn-dark dropdown-toggle w-50"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedLanguage} Top Picks
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => setSelectedLanguage("Hindi")}
            >
              Hindi
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => setSelectedLanguage("English")}
            >
              English
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => setSelectedLanguage("Punjabi")}
            >
              Punjabi
            </a>
          </li>
        </ul>
      </div>

      {/* Render All Tags on Larger Screens */}
      <div className="d-none d-sm-flex flex-wrap tags">
        {tags.map((tag, index) => (
          <button
            key={index}
            className="btn btn-outline-secondary me-2 mb-2"
            onClick={(event) => handleTagClick(event, tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Render Tags Conditionally Based on Dropdown Selection for Small Screens */}
      <div className="d-sm-none tags">
        <div className="d-flex flex-wrap">
          {tagsToDisplay.map((tag, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary me-2 mb-2"
              onClick={(event) => handleTagClick(event, tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>

      <main className="container my-4">
        {error && (
          <div className="alert alert-danger text-center my-4" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {tracks.map((element, index) => (
              <div
                className="col"
                key={index}
                onClick={() => handlePlay(element)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={element.image[2].link}
                    className="card-img-top"
                    alt="cover"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{element.name}</h5>
                    <div className="card-text">{element.primaryArtists}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
                <p>{nowPlaying.primaryArtists}</p>
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
    </>
  );
}

export default App;
