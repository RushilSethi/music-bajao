import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState(3);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [
      {
        "id": "Q6l0a09y",
        "name": "Aaj Ki Raat",
        "type": "",
        "album": {
            "id": "57019500",
            "name": "Stree 2",
            "url": "https://www.jiosaavn.com/album/stree-2/VCjKuSJcwxs_"
        },
        "year": "2024",
        "releaseDate": null,
        "duration": "228",
        "label": "SaReGaMA India Ltd",
        "primaryArtists": "Amitabh Bhattacharya, Sachin-Jigar, Madhubanti Bagchi, Divya Kumar",
        "primaryArtistsId": "458681, 461968, 670466, 473376",
        "featuredArtists": "",
        "featuredArtistsId": "",
        "explicitContent": 0,
        "playCount": "39602671",
        "language": "hindi",
        "hasLyrics": "true",
        "url": "https://www.jiosaavn.com/song/aaj-ki-raat/IV4HARUADko",
        "copyright": "℗ 2024 Saregama India Ltd",
        "image": [
            {
                "quality": "50x50",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-50x50.jpg"
            },
            {
                "quality": "150x150",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-150x150.jpg"
            },
            {
                "quality": "500x500",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg"
            }
        ],
        "downloadUrl": [
            {
                "quality": "12kbps",
                "link": "https://aac.saavncdn.com/373/36b1b3637cdeedfaa9a9012453948aa6_12.mp4"
            },
            {
                "quality": "48kbps",
                "link": "https://aac.saavncdn.com/373/36b1b3637cdeedfaa9a9012453948aa6_48.mp4"
            },
            {
                "quality": "96kbps",
                "link": "https://aac.saavncdn.com/373/36b1b3637cdeedfaa9a9012453948aa6_96.mp4"
            },
            {
                "quality": "160kbps",
                "link": "https://aac.saavncdn.com/373/36b1b3637cdeedfaa9a9012453948aa6_160.mp4"
            },
            {
                "quality": "320kbps",
                "link": "https://aac.saavncdn.com/373/36b1b3637cdeedfaa9a9012453948aa6_320.mp4"
            }
        ]
    },
    {
        "id": "S0U546YS",
        "name": "Millionaire",
        "type": "",
        "album": {
            "id": "57246869",
            "name": "GLORY",
            "url": "https://www.jiosaavn.com/album/glory/2dbt04J5vGA_"
        },
        "year": "2024",
        "releaseDate": null,
        "duration": "199",
        "label": "T-Series",
        "primaryArtists": "Yo Yo Honey Singh",
        "primaryArtistsId": "485956",
        "featuredArtists": "",
        "featuredArtistsId": "",
        "explicitContent": 1,
        "playCount": "11529513",
        "language": "hindi",
        "hasLyrics": "true",
        "url": "https://www.jiosaavn.com/song/millionaire/I1g,BEAGbmA",
        "copyright": "℗ 2024 Super Cassettes Industries Private Limited",
        "image": [
            {
                "quality": "50x50",
                "link": "https://c.saavncdn.com/173/GLORY-Hindi-2024-20240926151002-50x50.jpg"
            },
            {
                "quality": "150x150",
                "link": "https://c.saavncdn.com/173/GLORY-Hindi-2024-20240926151002-150x150.jpg"
            },
            {
                "quality": "500x500",
                "link": "https://c.saavncdn.com/173/GLORY-Hindi-2024-20240926151002-500x500.jpg"
            }
        ],
        "downloadUrl": [
            {
                "quality": "12kbps",
                "link": "https://aac.saavncdn.com/173/e98d601d7cfc68d0035f4e8a2deae6f9_12.mp4"
            },
            {
                "quality": "48kbps",
                "link": "https://aac.saavncdn.com/173/e98d601d7cfc68d0035f4e8a2deae6f9_48.mp4"
            },
            {
                "quality": "96kbps",
                "link": "https://aac.saavncdn.com/173/e98d601d7cfc68d0035f4e8a2deae6f9_96.mp4"
            },
            {
                "quality": "160kbps",
                "link": "https://aac.saavncdn.com/173/e98d601d7cfc68d0035f4e8a2deae6f9_160.mp4"
            },
            {
                "quality": "320kbps",
                "link": "https://aac.saavncdn.com/173/e98d601d7cfc68d0035f4e8a2deae6f9_320.mp4"
            }
        ]
    },
    {
        "id": "Ap1mYWUe",
        "name": "Saudebazi (Encore)",
        "type": "",
        "album": {
            "id": "1017711",
            "name": "Aakrosh",
            "url": "https://www.jiosaavn.com/album/aakrosh/wtIPeQGgvwI_"
        },
        "year": "2010",
        "releaseDate": null,
        "duration": "354",
        "label": "T-Series",
        "primaryArtists": "Javed Ali",
        "primaryArtistsId": "455926",
        "featuredArtists": "",
        "featuredArtistsId": "",
        "explicitContent": 0,
        "playCount": "21010817",
        "language": "hindi",
        "hasLyrics": "true",
        "url": "https://www.jiosaavn.com/song/saudebazi-encore/MRhaXC1nYlY",
        "copyright": "℗ 2010 Super Cassettes Industries Private Limited",
        "image": [
            {
                "quality": "50x50",
                "link": "https://c.saavncdn.com/427/Aakrosh-Hindi-2010-20221211135423-50x50.jpg"
            },
            {
                "quality": "150x150",
                "link": "https://c.saavncdn.com/427/Aakrosh-Hindi-2010-20221211135423-150x150.jpg"
            },
            {
                "quality": "500x500",
                "link": "https://c.saavncdn.com/427/Aakrosh-Hindi-2010-20221211135423-500x500.jpg"
            }
        ],
        "downloadUrl": [
            {
                "quality": "12kbps",
                "link": "https://aac.saavncdn.com/427/6afd29e2afdbf16f6f36bd0b1c2ef3ac_12.mp4"
            },
            {
                "quality": "48kbps",
                "link": "https://aac.saavncdn.com/427/6afd29e2afdbf16f6f36bd0b1c2ef3ac_48.mp4"
            },
            {
                "quality": "96kbps",
                "link": "https://aac.saavncdn.com/427/6afd29e2afdbf16f6f36bd0b1c2ef3ac_96.mp4"
            },
            {
                "quality": "160kbps",
                "link": "https://aac.saavncdn.com/427/6afd29e2afdbf16f6f36bd0b1c2ef3ac_160.mp4"
            },
            {
                "quality": "320kbps",
                "link": "https://aac.saavncdn.com/427/6afd29e2afdbf16f6f36bd0b1c2ef3ac_320.mp4"
            }
        ]
    },
    {
        "id": "ZsGGaRro",
        "name": "Aayi Nai",
        "type": "",
        "album": {
            "id": "57019500",
            "name": "Stree 2",
            "url": "https://www.jiosaavn.com/album/stree-2/VCjKuSJcwxs_"
        },
        "year": "2024",
        "releaseDate": null,
        "duration": "178",
        "label": "SaReGaMA India Ltd",
        "primaryArtists": "Amitabh Bhattacharya, Sachin-Jigar, Pawan Singh, Simran Choudhary, Divya Kumar",
        "primaryArtistsId": "458681, 461968, 456857, 5836531, 473376",
        "featuredArtists": "",
        "featuredArtistsId": "",
        "explicitContent": 0,
        "playCount": "21429655",
        "language": "hindi",
        "hasLyrics": "true",
        "url": "https://www.jiosaavn.com/song/aayi-nai/KhssdhViRVw",
        "copyright": "℗ 2024 Saregama India Ltd",
        "image": [
            {
                "quality": "50x50",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-50x50.jpg"
            },
            {
                "quality": "150x150",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-150x150.jpg"
            },
            {
                "quality": "500x500",
                "link": "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg"
            }
        ],
        "downloadUrl": [
            {
                "quality": "12kbps",
                "link": "https://aac.saavncdn.com/373/9a3ad2173b2e80bc6f9655d1da7c8f27_12.mp4"
            },
            {
                "quality": "48kbps",
                "link": "https://aac.saavncdn.com/373/9a3ad2173b2e80bc6f9655d1da7c8f27_48.mp4"
            },
            {
                "quality": "96kbps",
                "link": "https://aac.saavncdn.com/373/9a3ad2173b2e80bc6f9655d1da7c8f27_96.mp4"
            },
            {
                "quality": "160kbps",
                "link": "https://aac.saavncdn.com/373/9a3ad2173b2e80bc6f9655d1da7c8f27_160.mp4"
            },
            {
                "quality": "320kbps",
                "link": "https://aac.saavncdn.com/373/9a3ad2173b2e80bc6f9655d1da7c8f27_320.mp4"
            }
        ]
    },

    ];
  });
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toast function to show notifications
  const showToast = (message, confirm = false, onConfirm = () => {}) => {
    const toastDiv = document.createElement('div');
    toastDiv.className = "toast align-items-center show";
    toastDiv.role = "alert";
    toastDiv.ariaLive = "assertive";
    toastDiv.ariaAtomic = "true";

    if (confirm) {
      toastDiv.innerHTML = `
        <div class="toast-body">${message}
          <div class="mt-2 pt-2 border-top">
            <button type="button" class="btn btn-primary btn-sm" id="confirm-btn">Confirm</button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Cancel</button>
          </div>
        </div>
      `;
      document.getElementById('confirm-btn').onclick = () => {
        onConfirm();
        toastDiv.remove();
      };
    } else {
      toastDiv.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
    }

    document.body.appendChild(toastDiv);

    setTimeout(() => {
      toastDiv.classList.remove("show");
      document.body.removeChild(toastDiv);
    }, 3000);
  };

  // Function to add a song to favorites
  const addFavorite = (track) => {
    if (!favorites.some(favTrack => favTrack.id === track.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, track]);
      showToast(`${track.name} has been added to your favorites.`);
    } else {
      showToast(`${track.name} is already in your favorites.`);
    }
  };

  // Function to remove a song from favorites with confirmation
  const removeFavorite = (trackId) => {
    const track = favorites.find(favTrack => favTrack.id === trackId);
    if (track) {
      showToast(`Are you sure you want to remove ${track.name} from favorites?`, true, () => {
        setFavorites((prevFavorites) => prevFavorites.filter(favTrack => favTrack.id !== trackId));
        showToast(`${track.name} has been removed from your favorites.`);
      });
    }
  };




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

  const isFavorite = (trackId) => {
    return favorites.some(track => track.id === trackId);
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
        isFavorite
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
