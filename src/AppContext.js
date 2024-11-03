import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState(3);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toast function to show notifications
  const showToast = (message, confirm = false, onConfirm = () => {}) => {
    const toastDiv = document.createElement('div');
    toastDiv.className = "toast align-items-center show custom-toast";
    toastDiv.role = "alert";
    toastDiv.ariaLive = "assertive";
    toastDiv.ariaAtomic = "true";

    if (confirm) {
        toastDiv.innerHTML = `
          <div class="toast-body">${message}
            <div class="mt-2 pt-2 border-top">
              <button type="button" class="btn btn-danger btn-sm" id="confirm-btn">Confirm</button>
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Cancel</button>
            </div>
          </div>
        `;
        document.body.appendChild(toastDiv);
        
        // Wait for the DOM to update before attaching the event listener
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirm-btn');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    onConfirm();
                    if (toastDiv.parentNode) {
                        toastDiv.remove();
                    }
                };
            }
        }, 0);
    } else {
        toastDiv.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" style="filter: brightness(0) invert(1);" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        `;
        document.body.appendChild(toastDiv);
    }

    setTimeout(() => {
        toastDiv.classList.remove("show");
        if (toastDiv.parentNode) {  // Check if toastDiv still exists in the DOM
            document.body.removeChild(toastDiv);
        }
    }, 3000);
};


  // Function to add a song to favorites
  const addFavorite = (track) => {
    if (!favorites.some((favTrack) => favTrack.id === track.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, track]);
      showToast(`${track.name} has been added to your playlist.`);
    } else {
      showToast(`${track.name} is already in your playlist.`);
    }
  };

  // Function to remove a song from favorites with confirmation
  const removeFavorite = (trackId) => {
    const track = favorites.find((favTrack) => favTrack.id === trackId);
    if (track) {
      showToast(
        `Are you sure you want to remove ${track.name} from favorites?`,
        true,
        () => {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((favTrack) => favTrack.id !== trackId)
          );
          showToast(`${track.name} has been removed from your playlist.`);
        }
      );
    }
  };

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

  const isFavorite = (trackId) => {
    return favorites.some((track) => track.id === trackId);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <AppContext.Provider
      value={{
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
        truncateText
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
