import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/PlayerContext";
import {
  FaPlay,
  FaTrashAlt,
  FaSearch,
  FaHeart,
  FaClock,
  FaMusic,
} from "react-icons/fa";

const FavoritesPage = () => {
  const { handlePlay, favorites, removeFavorite, truncateText } =
    useAppContext();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter favorites based on search query
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;

    return favorites.filter(
      (track) =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.primaryArtists.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favorites, searchQuery]);

  // Calculate total duration
  const totalDuration = useMemo(() => {
    const totalSeconds = favorites.reduce(
      (sum, track) => sum + parseInt(track.duration || 0),
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [favorites]);

  const renderTrackCard = (track, index) => {
    const cardId = `fav-card-${index}`;

    return (
      <div
        key={track.id || index}
        id={cardId}
        className="card mb-3 position-relative"
        style={{
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
          e.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)";
        }}
        onClick={() => handlePlay(track, "favorites")}
      >
        {/* Reflective gradient overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 25%, 
              transparent 50%, 
              transparent 75%, 
              rgba(0, 0, 0, 0.1) 100%)`,
            borderRadius: "16px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Dynamic color reflection from image */}
        <canvas
          id={`fav-canvas-${index}`}
          width="1"
          height="1"
          style={{ display: "none" }}
        />
        <div
          id={`fav-reflection-${index}`}
          className="position-absolute w-100 h-100"
          style={{
            borderRadius: "16px",
            pointerEvents: "none",
            opacity: 0.5,
            zIndex: 0,
            transition: "opacity 0.5s ease",
          }}
        />

        <div
          className="row g-0 h-100"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div className="col-4 col-md-3 position-relative">
            <div
              className="position-relative h-100"
              style={{
                overflow: "hidden",
                borderRadius: "16px 0 0 16px",
                minHeight: "120px",
              }}
            >
              <img
                src={track.image[2].link}
                className="img-fluid w-100 h-100"
                alt={track.name}
                crossOrigin="anonymous"
                style={{
                  objectFit: "cover",
                  transition: "all 0.3s ease",
                }}
                onLoad={(e) => {
                  // Extract colors from image for reflection effect
                  const img = e.target;
                  const canvas = document.getElementById(`fav-canvas-${index}`);
                  const reflection = document.getElementById(
                    `fav-reflection-${index}`
                  );

                  if (canvas && reflection) {
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;

                    try {
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      const imageData = ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );
                      const data = imageData.data;

                      let r = 0,
                        g = 0,
                        b = 0;
                      let count = 0;

                      // Sample colors from the image
                      for (let i = 0; i < data.length; i += 4) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                      }

                      r = Math.floor(r / count);
                      g = Math.floor(g / count);
                      b = Math.floor(b / count);

                      // Create gradient reflection
                      reflection.style.background = `
                        linear-gradient(135deg, 
                          rgba(${r}, ${g}, ${b}, 0.6) 0%,
                          rgba(${r}, ${g}, ${b}, 0.4) 30%,
                          rgba(${r}, ${g}, ${b}, 0.2) 60%,
                          transparent 100%
                        )
                      `;
                    } catch (error) {
                      // Fallback for CORS issues
                      reflection.style.background = `
                        linear-gradient(135deg, 
                          rgba(100, 50, 200, 0.5) 0%,
                          rgba(50, 100, 255, 0.3) 50%,
                          rgba(255, 100, 150, 0.2) 80%,
                          transparent 100%
                        )
                      `;
                    }
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.filter = "brightness(0.7) contrast(1.1)";
                  const playOverlay =
                    e.target.parentNode.querySelector(".play-overlay");
                  if (playOverlay) playOverlay.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = "brightness(1) contrast(1)";
                  const playOverlay =
                    e.target.parentNode.querySelector(".play-overlay");
                  if (playOverlay) playOverlay.style.opacity = "0";
                }}
              />

              {/* Play overlay on hover */}
              <div
                className="position-absolute top-50 start-50 translate-middle play-overlay"
                style={{
                  opacity: "0",
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <FaPlay
                    style={{
                      color: "#333",
                      fontSize: "16px",
                      marginLeft: "2px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-8 col-md-9 d-flex flex-column justify-content-between">
            <div className="card-body" style={{ background: "transparent" }}>
              <h5
                className="card-title"
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  marginBottom: "8px",
                }}
              >
                {track.name}
              </h5>
              <p
                className="card-text"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.9rem",
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                  marginBottom: "6px",
                }}
              >
                {truncateText(track.primaryArtists, 25)}
              </p>
              <p
                className="card-text"
                style={{
                  marginBottom: "0",
                }}
              >
                <small
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.8rem",
                  }}
                >
                  <FaClock className="me-1" />
                  {Math.floor(track.duration / 60)}:
                  {String(track.duration % 60).padStart(2, "0")}
                </small>
              </p>
            </div>

            <div
              className="card-footer d-flex justify-content-end"
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
              }}
            >
              <button
                className="btn btn-sm"
                style={{
                  background: "linear-gradient(135deg, #ff4757, #ff3742)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  padding: "8px 16px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    "0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(track.id);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ff3742, #ff2d3a)";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(255, 71, 87, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ff4757, #ff3742)";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                }}
              >
                <FaTrashAlt className="me-1" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            {/* Bold Heading with Icon */}
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #ff4757, #ff3742)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(255, 71, 87, 0.4)",
                }}
              >
                <FaHeart style={{ color: "white", fontSize: "24px" }} />
              </div>
              <div>
                <h1
                  className="mb-0"
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #fff, #e1e8ed)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Your Favorites
                </h1>
                <p
                  className="mb-0 mt-1"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "1rem",
                  }}
                >
                  Your most loved tracks
                </p>
              </div>
            </div>

            {/* Collection Stats */}
            <div
              className="d-flex gap-3 p-3"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="text-center">
                <div
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  {favorites.length}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.8rem",
                  }}
                >
                  <FaMusic className="me-1" />
                  Songs
                </div>
              </div>
              <div
                style={{
                  width: "1px",
                  background: "rgba(255, 255, 255, 0.2)",
                }}
              />
              <div className="text-center">
                <div
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  {totalDuration}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.8rem",
                  }}
                >
                  <FaClock className="me-1" />
                  Duration
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="position-relative">
                <FaSearch
                  className="position-absolute top-50 translate-middle-y ms-3"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "1rem",
                    zIndex: 2,
                  }}
                />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    color: "#fff",
                    padding: "12px 20px 12px 45px",
                    backdropFilter: "blur(20px)",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.border =
                      "1px solid rgba(255, 255, 255, 0.3)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(255, 255, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border =
                      "1px solid rgba(255, 255, 255, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="row">
        <div className="col-12">
          {filteredFavorites.length === 0 ? (
            <div
              className="text-center py-5"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                backdropFilter: "blur(20px)",
              }}
            >
              {searchQuery ? (
                <>
                  <FaSearch
                    style={{
                      fontSize: "3rem",
                      color: "rgba(255, 255, 255, 0.3)",
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No songs found
                  </h3>
                  <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Try adjusting your search terms
                  </p>
                </>
              ) : (
                <>
                  <FaHeart
                    style={{
                      fontSize: "3rem",
                      color: "rgba(255, 255, 255, 0.3)",
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No favorites yet
                  </h3>
                  <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Add songs from the home page to see them here
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="row g-3">
              {filteredFavorites.map((track, index) => (
                <div key={track.id || index} className="col-12 col-lg-6">
                  {renderTrackCard(track, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
