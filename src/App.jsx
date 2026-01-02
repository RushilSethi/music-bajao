import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from "./context/PlayerContext";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import TrackDetailModal from "./components/TrackDetailModal";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import MusicSearchPage from "./pages/MusicSearchPage";
import ExploreDetailsPage from "./pages/ExploreDetailsPage";
import ArtistAlbumPage from "./pages/ArtistAlbumPage";
import RadioPage from "./pages/RadioPage";
import QuirkyErrorPage from "./pages/QuirkyErrorPage";

const App = () => {
  const { getTracks, audioRef } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const modalTrackId = searchParams.get('modaltrackid');

  const [triggerFetch, setTriggerFetch] = useState(false);

  const navigate = useNavigate();
  const handleNavigateToDetail = (type, id) => {
    console.log("navigating to the said page");
    navigate(`/explore/${type}/${id}`);
  };

  const handleCloseModal = () => {
    setSearchParams({});
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
        <Route path="/explore/:type/:id" element={<ExploreDetailsPage />} />
        <Route path="/explore/artist/:artistId/album/:albumId" element={<ArtistAlbumPage />} />
        {/* <Route path="/radio" element={<RadioPage />} /> */}
        <Route path="*" element={<QuirkyErrorPage />} />
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

      {/* Track Detail Modal - Renders at App level to overlay entire screen */}
      <TrackDetailModal 
        trackId={modalTrackId} 
        isOpen={!!modalTrackId} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default App;
