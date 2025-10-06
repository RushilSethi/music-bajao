import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useAppContext } from "./AppContext";

function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");

  const {
    keyword,
    setKeyword,
    tracks,
    setTracks,
    loading,
    setLoading,
    error,
    setError,
    handlePlay,
    selectedBitrate,
    audioRef,
    addFavorite,
    decodeHtmlEntities
  } = useAppContext();

  const allTags = [
    "Hindi", "English Songs", "Punjabi Hits", "Bollywood Hits", "Old Songs", "Workout Mix",
    "Arijit Singh", "KK", "Neha Kakkar", "Badshah", "Atif Aslam", "Guru Randhawa",
    "Shreya Ghoshal", "Harrdy Sandhu", "Darshan Raval", "Diljit Dosanjh", "Armaan Malik",
    "Karan Aujla", "Yo Yo Honey Singh", "Billie Eilish", "Justin Bieber", "Imagine Dragons",
    "Ed Sheeran", "Taylor Swift", "Sia", "The Weeknd", "Rihanna", "One Direction",
    "Michael Jackson", "Charlie Puth", "The Chainsmokers", "Shawn Mendes",
  ];

  const tagsMap = {
    Hindi: ["Hindi", "Bollywood Hits", "Arijit Singh", "KK", "Neha Kakkar", "Badshah", "Atif Aslam", "Shreya Ghoshal", "Harrdy Sandhu", "Darshan Raval", "Armaan Malik", "Old Songs", "Workout Mix"],
    English: ["English Songs", "Billie Eilish", "Justin Bieber", "Imagine Dragons", "Ed Sheeran", "Taylor Swift", "Sia", "The Weeknd", "Rihanna", "One Direction", "Michael Jackson", "Charlie Puth", "The Chainsmokers", "Shawn Mendes", "Workout Mix"],
    Punjabi: ["Punjabi Hits", "Diljit Dosanjh", "Guru Randhawa", "Karan Aujla", "Yo Yo Honey Singh", "Harrdy Sandhu", "Workout Mix"],
  };

  const tagsToDisplay = tagsMap[selectedLanguage];

  const getTracksByTag = async (tag) => {
    setLoading(true);
    setError(null);
    setKeyword(tag);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/search/songs?query=${tag}&limit=40`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setTracks(data.data.results);
    } catch {
      setError("Error fetching data. Try to reload the page or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    getTracksByTag(tag);
  };

  return (
    <>
      {/* Tag section */}
      <div className="container my-2">
        {/* Language Selector (Mobile only) */}
        <div className="d-sm-none mb-3 dropdown">
          <button
            className="btn btn-dark dropdown-toggle w-50"
            type="button"
            data-bs-toggle="dropdown"
          >
            {selectedLanguage} Top Picks
          </button>
          <ul className="dropdown-menu">
            {["Hindi", "English", "Punjabi"].map((lang) => (
              <li key={lang}>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* All tags (Desktop) */}
        <div className="d-none d-sm-flex flex-wrap tags">
          {allTags.map((tag, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary me-2 mb-2"
              onClick={(e) => handleTagClick(e, tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Filtered tags (Mobile only) */}
        <div className="d-sm-none tags">
          <div className="d-flex flex-wrap">
            {tagsToDisplay.map((tag, index) => (
              <button
                key={index}
                className="btn btn-outline-secondary me-2 mb-2"
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track Cards */}
      <main className="container my-4">
        {error && (
          <div className="alert alert-danger text-center my-4" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {tracks.map((track, index) => (
              <div className="col" key={index} style={{ cursor: "pointer" }}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={track.image[2].link}
                    className="card-img-top"
                    alt="cover"
                    onClick={() => handlePlay(track, "home")}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{decodeHtmlEntities(track.name)}</h5>
                    <div className="card-text">{decodeHtmlEntities(track.primaryArtists)}</div>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addFavorite(track);
                      }}
                    >
                      <FaHeart className="me-1" /> Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default HomePage;
