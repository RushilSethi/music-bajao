import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [playRandom, setPlayRandom] = useState(false);
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
  const [playSource, setPlaySource] = useState(null);
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

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
    const toastDiv = document.createElement("div");
    toastDiv.className = "toast align-items-center show custom-toast";
    toastDiv.role = "alert";
    toastDiv.ariaLive = "assertive";
    toastDiv.ariaAtomic = "true";

    if (confirm) {
      toastDiv.innerHTML = `
          <div class="toast-body">${message}
            <div class="mt-2 pt-2">
              <button type="button" class="btn btn-danger btn-sm" id="confirm-btn">Confirm</button>
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Cancel</button>
            </div>
          </div>
        `;
      document.body.appendChild(toastDiv);

      // Wait for the DOM to update before attaching the event listener
      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-btn");
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
      if (toastDiv.parentNode) {
        // Check if toastDiv still exists in the DOM
        document.body.removeChild(toastDiv);
      }
    }, 3000);
  };

  // Function to add a song to favorites
  const addFavorite = (track) => {
    if (!favorites.some((favTrack) => favTrack.id === track.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, track]);
      showToast(
        `${decodeHtmlEntities(track.name)} has been added to your playlist.`
      );
    } else {
      showToast(
        `${decodeHtmlEntities(track.name)} is already in your playlist.`
      );
    }
  };

  // Function to remove a song from favorites with confirmation
  const removeFavorite = (trackId) => {
    const track = favorites.find((favTrack) => favTrack.id === trackId);
    if (track) {
      showToast(
        `Are you sure you want to remove ${decodeHtmlEntities(
          track.name
        )} from favorites?`,
        true,
        () => {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((favTrack) => favTrack.id !== trackId)
          );
          showToast(
            `${decodeHtmlEntities(
              track.name
            )} has been removed from your playlist.`
          );
        }
      );
    }
  };

  const decodeHtmlEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  async function getTracks(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let data = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/search/songs?query=${
          keyword === "" ? "hindi" : keyword
        }&limit=40`
      );
      if (!data.ok) throw new Error("Network response was not ok");
      let convertedData = await data.json();
      console.log(convertedData);
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

  // Helper function to get current track index in queue
  const getCurrentTrackIndex = () => {
    if (!nowPlaying) return -1;
    return queue.findIndex(
      (track) => track.id === nowPlaying.id && track.isCurrentlyPlaying
    );
  };

  // Enhanced function to add tracks to queue with source context
  const addToQueue = (tracks, source) => {
    setQueue((prevQueue) => {
      const existingIds = new Set(prevQueue.map((t) => t.id));
      const newTracks = tracks
        .filter((track) => !existingIds.has(track.id))
        .map((track) => ({
          ...track,
          listenedTo: false,
          isCurrentlyPlaying: false,
          source: source,
        }));

      return [...prevQueue, ...newTracks];
    });
  };

  const handlePlay = (track, source, playlistContext = null) => {
    // Handle radio source separately - don't create queue like other sources
    if (source === 'radio') {
      setPlaySource('radio');
      setNowPlaying(track);
      setQueue([{ ...track, isCurrentlyPlaying: true, source: 'radio' }]);
      if (audioRef.current) {
        // For radio, use the stream URL directly
        const streamUrl = track.downloadUrl?.[0]?.link || track.url_resolved;
        audioRef.current.src = streamUrl;
        audioRef.current.play().catch((error) => {
          console.error("Error playing radio stream:", error);
          showToast("Error streaming this station. Please try another.");
        });
      }
      return;
    }

    // Unify 'album' and 'artist' as 'playlist' for playback logic
    let unifiedSource = source;
    if (source === 'album' || source === 'artist') {
      unifiedSource = 'playlist';
    }
    setPlaySource(unifiedSource);
    // If playlist context is provided, update it
    if (unifiedSource === 'playlist' && playlistContext) {
      setCurrentPlaylist(playlistContext);
    }
    // Always set the full playlist as the queue for playlist source
    if (unifiedSource === 'playlist' && (currentPlaylist?.tracks?.length || playlistContext?.tracks?.length)) {
      const playlistTracks = (playlistContext?.tracks || currentPlaylist.tracks).map((plTrack) => ({
        ...plTrack,
        listenedTo: false,
        isCurrentlyPlaying: plTrack.id === track.id,
        source: 'playlist',
      }));
      let finalQueue = playlistTracks;
      if (playRandom) {
        // Shuffle the playlist
        for (let i = finalQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalQueue[i], finalQueue[j]] = [finalQueue[j], finalQueue[i]];
        }
        // Ensure the selected track is first and marked as currently playing
        const selectedIdx = finalQueue.findIndex(t => t.id === track.id);
        if (selectedIdx > 0) {
          [finalQueue[0], finalQueue[selectedIdx]] = [finalQueue[selectedIdx], finalQueue[0]];
        }
        finalQueue = finalQueue.map((t, idx) => ({
          ...t,
          isCurrentlyPlaying: idx === 0
        }));
      }
      setQueue(finalQueue);
      setNowPlaying(finalQueue.find(t => t.isCurrentlyPlaying) || finalQueue[0]);
      // Handle audio playback
      if (audioRef.current) {
        const np = finalQueue.find(t => t.isCurrentlyPlaying) || finalQueue[0];
        audioRef.current.src = np.downloadUrl[selectedBitrate].link;
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          showToast("Error playing this track. Please try another.");
        });
      }
      return;
    }
    // For favorites, set all favorites as queue
    if (unifiedSource === 'favorites') {
      const favoritesQueue = favorites.map((fav) => ({
        ...fav,
        listenedTo: false,
        isCurrentlyPlaying: fav.id === track.id,
        source: 'favorites',
      }));
      setQueue(favoritesQueue);
      setNowPlaying(favoritesQueue.find(t => t.isCurrentlyPlaying) || favoritesQueue[0]);
      if (audioRef.current) {
        const np = favoritesQueue.find(t => t.isCurrentlyPlaying) || favoritesQueue[0];
        audioRef.current.src = np.downloadUrl[selectedBitrate].link;
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          showToast("Error playing this track. Please try another.");
        });
      }
      return;
    }
    // For home or other sources, just play the single track
    setQueue([{ ...track, listenedTo: false, isCurrentlyPlaying: true, source: unifiedSource }]);
    setNowPlaying(track);
    if (audioRef.current) {
      audioRef.current.src = track.downloadUrl[selectedBitrate].link;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        showToast("Error playing this track. Please try another.");
      });
    }
  };

  // Helper function to normalize song data from different API formats
  const normalizeSongData = (song) => {
    // If it's already in the old format, return as is
    if (song.primaryArtists && song.primaryArtistsId) {
      return song;
    }

    // Convert new artist API format to old format for compatibility
    let primaryArtists = "";
    let primaryArtistsId = "";
    let featuredArtists = "";
    let featuredArtistsId = "";

    if (song.artists && typeof song.artists === "object") {
      // Build primary artists string and IDs
      if (song.artists.primary && Array.isArray(song.artists.primary)) {
        primaryArtists = song.artists.primary.map((a) => a.name).join(", ");
        primaryArtistsId = song.artists.primary.map((a) => a.id).join(", ");
      }

      // Build featured artists string and IDs
      if (song.artists.featured && Array.isArray(song.artists.featured)) {
        featuredArtists = song.artists.featured.map((a) => a.name).join(", ");
        featuredArtistsId = song.artists.featured.map((a) => a.id).join(", ");
      }
    }

    // Normalize download URLs (artist API uses 'url' instead of 'link')
    const downloadUrl = song.downloadUrl
      ? song.downloadUrl.map((item) => ({
          quality: item.quality,
          link: item.url || item.link, // Handle both formats
        }))
      : [];

    // Normalize image URLs
    const image = song.image
      ? song.image.map((item) => ({
          quality: item.quality,
          link: item.url || item.link, // Handle both formats
        }))
      : [];

    return {
      ...song,
      primaryArtists,
      primaryArtistsId,
      featuredArtists,
      featuredArtistsId,
      downloadUrl,
      image,
      duration: song.duration?.toString() || "0", // Ensure duration is string
    };
  };

  // Helper function to extract artist IDs from different API response formats
  const extractArtistIds = (song) => {
    const artistIds = new Set();

    // Handle new API format (artist songs API) - artists object with primary/featured arrays
    if (song.artists && typeof song.artists === "object") {
      // Extract from primary artists
      if (song.artists.primary && Array.isArray(song.artists.primary)) {
        song.artists.primary.forEach((artist) => {
          if (artist.id) artistIds.add(artist.id);
        });
      }

      // Extract from featured artists
      if (song.artists.featured && Array.isArray(song.artists.featured)) {
        song.artists.featured.forEach((artist) => {
          if (artist.id) artistIds.add(artist.id);
        });
      }
    }

    // Handle old API format (search API) - comma-separated ID strings
    if (song.primaryArtistsId) {
      song.primaryArtistsId.split(",").forEach((id) => {
        const cleanId = id.trim();
        if (cleanId) artistIds.add(cleanId);
      });
    }

    if (song.featuredArtistsId) {
      song.featuredArtistsId.split(",").forEach((id) => {
        const cleanId = id.trim();
        if (cleanId) artistIds.add(cleanId);
      });
    }

    return Array.from(artistIds);
  };

  // Helper function to get random items from array
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const fetchArtistBasedRecommendations = async (currentQueue) => {
    console.log("Artist-based recommendation triggered");

    // Only fetch recommendations for "home" source
    if (playSource !== "home") {
      console.log("Not in home source, skipping recommendations");
      return;
    }

    const listenedSongs = currentQueue.filter(
      (t) => t.listenedTo && t.source === "home"
    );
    if (listenedSongs.length === 0) {
      console.log(
        "No songs listened to yet from home source, skipping recommendations."
      );
      return;
    }

    try {
      // Extract all unique artist IDs from listened songs
      const allArtistIds = new Set();
      listenedSongs.forEach((song) => {
        const artistIds = extractArtistIds(song);
        artistIds.forEach((id) => {
          if (id) allArtistIds.add(id);
        });
      });

      const artistIdsArray = Array.from(allArtistIds);
      console.log("Found artist IDs:", artistIdsArray);

      if (artistIdsArray.length === 0) {
        console.log("No artist IDs found, falling back to AI recommendations");
        return await fetchAIRecommendations(currentQueue);
      }

      // Get existing song IDs to avoid duplicates
      const existingSongIds = new Set(currentQueue.map((t) => t.id));
      const recommendedSongs = [];

      // Fetch songs from each artist (limit to avoid too many API calls)
      const selectedArtists = getRandomItems(
        artistIdsArray,
        Math.min(3, artistIdsArray.length)
      );

      for (const artistId of selectedArtists) {
        try {
          console.log(`Fetching songs from artist ${artistId}`);

          const response = await fetch(
            `${
              import.meta.env.VITE_APP_API_URL_SECONDARY
            }/artists/${artistId}/songs?page=0&sortBy=popularity&sortOrder=desc`
          );

          if (!response.ok) {
            console.log(`Failed to fetch songs for artist ${artistId}`);
            continue;
          }

          const data = await response.json();
          const artistSongs = data?.data?.songs || []; // Note: using 'songs' not 'results'

          if (artistSongs.length === 0) continue;

          // Filter out songs already in queue, normalize data, and get top songs
          const newSongs = artistSongs
            .map((song) => normalizeSongData(song)) // Normalize the data format
            .filter((song) => !existingSongIds.has(song.id))
            .slice(0, 3); // Max 3 songs per artist

          // Add to recommended songs
          newSongs.forEach((song) => {
            recommendedSongs.push({
              ...song,
              listenedTo: false,
              isCurrentlyPlaying: false,
              source: "home",
            });
            existingSongIds.add(song.id); // Prevent duplicates across artists
          });

          console.log(`Added ${newSongs.length} songs from artist ${artistId}`);

          // Stop if we have enough recommendations
          if (recommendedSongs.length >= 8) break;
        } catch (error) {
          console.error(`Error fetching songs for artist ${artistId}:`, error);
          continue;
        }
      }

      // If we got good recommendations from artists, use them
      if (recommendedSongs.length >= 3) {
        console.log(
          `Successfully got ${recommendedSongs.length} artist-based recommendations`
        );

        // Shuffle and limit the recommendations
        const finalRecommendations = getRandomItems(
          recommendedSongs,
          Math.min(6, recommendedSongs.length)
        );

        addToQueue(finalRecommendations, "home");
        // showToast(
        //   `Added ${finalRecommendations.length} songs from similar artists`
        // );

        return;
      }

      // Fallback to AI if artist-based recommendations didn't work well
      console.log(
        `Only got ${recommendedSongs.length} artist-based recommendations, falling back to AI`
      );

      // Add whatever artist recommendations we got
      if (recommendedSongs.length > 0) {
        addToQueue(recommendedSongs, "home");
        // showToast(
        //   `Added ${recommendedSongs.length} songs from artists, fetching more...`
        // );
      }

      // Then fetch AI recommendations to fill the gap
      await fetchAIRecommendations(currentQueue);
    } catch (error) {
      console.error("Artist-based recommendation error:", error);
      console.log("Falling back to AI recommendations due to error");
      await fetchAIRecommendations(currentQueue);
    }
  };

  // Updated AI recommendations function (simplified, used as fallback)
  const fetchAIRecommendations = async (currentQueue) => {
    console.log("AI recommendation fallback triggered");

    const listenedSongs = currentQueue.filter(
      (t) => t.listenedTo && t.source === "home"
    );
    if (listenedSongs.length === 0) {
      console.log(
        "No songs listened to yet from home source, skipping AI fallback."
      );
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        console.log("No AI API key found, skipping AI recommendations");
        return;
      }

      const referenceSection = listenedSongs
        .slice(-3) // last 3 songs
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const excludeSection = currentQueue
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const prompt = `You are a music recommendation AI.

The user has recently listened to these songs:
${referenceSection}

Do not recommend any of these (already in queue):
${excludeSection}

Your task:
- Identify the genres, mood, and *era* (decade/year) of the recent songs.
- Recommend 3 popular songs that match the same vibe and era, or from closely related genres/artists that the listener is likely to enjoy.
- Prioritize songs from a similar time period (if the user is listening to older music, suggest more from that era).
- Avoid suggesting extremely obscure songs — keep them recognizable but still fresh.

Output Format (strictly follow):
1. Song Name - Artist
2. Song Name - Artist
3. Song Name - Artist`;

      // ✅ OpenRouter request
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 120,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Invalid AI response");

      const recommendations = reply
        .split(/\n+/)
        .map((line) => {
          const match = line.match(/^\s*\d+\.\s*(.+?)\s*-\s*(.+?)\s*$/);
          if (match) {
            return {
              name: match[1].trim(),
              artist: match[2].trim(),
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 3);

      console.log("AI Recommendations:", recommendations);

      if (recommendations.length === 0) {
        console.log("No valid AI recommendations parsed");
        return;
      }

      // Search for each AI recommendation
      const foundSongs = [];
      for (const rec of recommendations) {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_APP_API_URL
            }/search/songs?query=${encodeURIComponent(
              rec.name + " " + rec.artist
            )}&limit=1`
          );
          const json = await res.json();
          const candidates = json?.data?.results || [];

          if (candidates.length > 0) {
            const song = candidates[0];
            const exists = currentQueue.some((s) => s.id === song.id);
            if (!exists) {
              foundSongs.push({
                ...song,
                listenedTo: false,
                isCurrentlyPlaying: false,
                source: "home",
              });
            }
          }
        } catch (error) {
          console.error(
            `Error searching for ${rec.name} - ${rec.artist}:`,
            error
          );
        }
      }

      if (foundSongs.length > 0) {
        addToQueue(foundSongs, "home");
        // showToast(`Added ${foundSongs.length} AI recommended songs`);
      }
    } catch (error) {
      console.error("AI Recommendation fallback error:", error);
      showToast("Could not fetch additional recommendations");
    }
  };

  const isFavorite = (trackId) => {
    return favorites.some((track) => track.id === trackId);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const loadPlaylist = (playlistData) => {
    if (
      !playlistData ||
      !playlistData.tracks ||
      !Array.isArray(playlistData.tracks)
    ) {
      showToast("Invalid playlist data");
      return;
    }

    setCurrentPlaylist(playlistData);
    showToast(`Loaded playlist: ${playlistData.name || "Untitled"}`);
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
        playRandom,
        setPlayRandom,
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
        truncateText,
        playSource,
        setPlaySource,
        queue,
        setQueue,
        getCurrentTrackIndex,
        addToQueue,
        fetchArtistBasedRecommendations,
        fetchAIRecommendations,
        showToast,
        decodeHtmlEntities,
        normalizeSongData,
        currentPlaylist,
        setCurrentPlaylist,
        loadPlaylist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
