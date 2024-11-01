import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState(3);
  const [nowPlaying, setNowPlaying] = useState(null);
  const audioRef = useRef(null);


  async function getTracks(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let data = await fetch(`${process.env.REACT_APP_API_URL}/search/songs?query=${keyword === "" ? "hindi" : keyword}&limit=40`);
      if (!data.ok) throw new Error("Network response was not ok");
      let convertedData = await data.json();
      setTracks(convertedData.data.results);
    } catch (error) {
      setError("Error fetching data. Try to reload the page or try again later.");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <AppContext.Provider
      value={{
        keyword, setKeyword, tracks, setTracks, loading, setLoading,  error, setError, selectedBitrate, nowPlaying, getTracks, handleBitrateChange, handlePlay, audioRef
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
