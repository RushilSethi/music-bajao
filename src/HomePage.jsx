import "./App.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Playlist from "./Playlist";
import { useAppContext } from "./AppContext";

function HomePage() {
  //   const [keyword, setKeyword] = useState("");
  //   const [tracks, setTracks] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  //   const [selectedBitrate, setSelectedBitrate] = useState(3);
  //   const [nowPlaying, setNowPlaying] = useState(null);
  //   const audioRef = useRef(null);
  //   const [selectedLanguage, setSelectedLanguage] = useState("Hindi");

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
    "Hindi",
    "Bollywood Hits",
    "Arijit Singh",
    "KK",
    "Neha Kakkar",
    "Badshah",
    "Atif Aslam",
    "Shreya Ghoshal",
    "Harrdy Sandhu",
    "Darshan Raval",
    "Armaan Malik",
    "Old Songs",
    "Workout Mix",
  ];

  const englishTags = [
    "English Songs",
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
    "Workout Mix",
  ];

  const punjabiTags = [
    "Punjabi Hits",
    "Diljit Dosanjh",
    "Guru Randhawa",
    "Karan Aujla",
    "Yo Yo Honey Singh",
    "Harrdy Sandhu",
    "Workout Mix",
  ];

  const tagsToDisplay =
    selectedLanguage === "Hindi"
      ? hindiTags
      : selectedLanguage === "English"
      ? englishTags
      : punjabiTags;

  //   async function getTracks(event) {
  //     if (event) event.preventDefault();
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       let data = await fetch(
  //         `${process.env.REACT_APP_API_URL}/search/songs?query=${
  //           keyword === "" ? "hindi" : keyword
  //         }&limit=40`
  //       );

  //       if (!data.ok) throw new Error("Network response was not ok");
  //       let convertedData = await data.json();
  //       setTracks(convertedData.data.results);
  //     } catch (error) {
  //       setError(
  //         "Error fetching data. Try to reload the page or try again later."
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   useEffect(() => {
  //     getTracks();
  //   }, []);

  //   useEffect(() => {
  //     if (audioRef.current) {
  //       audioRef.current.src = "";
  //     }
  //   }, []);

  //   const handleBitrateChange = (index) => {
  //     setSelectedBitrate(index);
  //     if (nowPlaying) {
  //       audioRef.current.src = nowPlaying.downloadUrl[index].link;
  //       audioRef.current.play();
  //     }
  //   };

  //   const handlePlay = (track) => {
  //     setNowPlaying(track);
  //     if (audioRef.current) {
  //       audioRef.current.src = track.downloadUrl[selectedBitrate].link;
  //       audioRef.current.play();
  //     }
  //   };

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
      setError(
        "Error fetching data. Try to reload the page or try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleTagClick = (event, tag) => {
    if (event) event.preventDefault();
    getTracksByTag(tag);
  };

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
  } = useAppContext();

  return (
    <>
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

export default HomePage;
