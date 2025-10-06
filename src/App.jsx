import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "./context/PlayerContext";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
// import AlbumsArtistsPage from "./pages/AlbumsArtistsPage";
import MusicSearchPage from "./pages/MusicSearchPage";
import ExploreDetailsPage from "./pages/ExploreDetailsPage";

const App = () => {
  const { getTracks, audioRef } = useAppContext();

  const [triggerFetch, setTriggerFetch] = useState(false);

  const navigate = useNavigate();
  const handleNavigateToDetail = (type, id) => {
    console.log("navigating to the said page");
    navigate(`/${type}/${id}`);
  };

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
    <>
      <Navbar setTriggerFetch={setTriggerFetch} />
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlist" element={<FavoritesPage />} />
        <Route path="/explore" element={<MusicSearchPage onNavigateToDetail={handleNavigateToDetail} />} />
        <Route path="/artist/:id" element={<ExploreDetailsPage />} />
        <Route path="/album/:id" element={<ExploreDetailsPage />} />
      </Routes>
      <footer className="text-center bg-dark text-light py-3">
        <p className="mb-4" style={{ fontSize: "0.9rem", margin: 0, paddingBottom: "6rem" }}>
          This website is not affiliated with, endorsed, sponsored, or
          specifically approved by any third-party music provider like Gaana,
          Saavn, Spotify, and is not responsible for any copyright material.
          <br />
          We don't serve any music on our servers.
          <br />
          Enjoy the music, hassle-free 🎼
        </p>
      </footer>
      <Footer />
    </>
  );
};

export default App;
