import { useState, useEffect } from "react";
import { FaHeart, FaPlay, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAppContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [isQuickAccessExpanded, setIsQuickAccessExpanded] = useState(false);

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
    decodeHtmlEntities,
  } = useAppContext();
  const navigate = useNavigate();

  const tagsMap = {
    Hindi: [
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
    ],
    English: [
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
    ],
    Punjabi: [
      "Punjabi Hits",
      "Diljit Dosanjh",
      "Guru Randhawa",
      "Karan Aujla",
      "Yo Yo Honey Singh",
      "AP Dhillon",
      "Harrdy Sandhu",
      "Workout Mix",
    ],
  };

  // Category cards configuration - reduced for mobile
  const categoryCards = [
    {
      id: "Hindi",
      title: "Hindi Music",
      subtitle: "Bollywood & More",
      icon: "🎵",
      gradient: "linear-gradient(135deg, #ff9a56, #ff6b6b)",
      count: tagsMap.Hindi.length,
    },
    {
      id: "English",
      title: "English Hits",
      subtitle: "Global Charts",
      icon: "🌍",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      count: tagsMap.English.length,
    },
    {
      id: "Punjabi",
      title: "Punjabi Beats",
      subtitle: "Desi Vibes",
      icon: "⚡",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
      count: tagsMap.Punjabi.length,
    },
    {
      id: "Trending",
      title: "Trending Now",
      subtitle: "Popular Picks",
      icon: "🔥",
      gradient: "linear-gradient(135deg, #ff512f, #dd2476)", // brighter red-pink
      count: "Explore",
      special: true,
    },
  ];

  const tagsToDisplay = tagsMap[selectedLanguage];

  const getTracksByTag = async (tag) => {
    setLoading(true);
    setError(null);
    setKeyword(tag);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/search/songs?query=${tag}&limit=40`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setTracks(data.data.results);
    } catch {
      setError(
        "Error fetching data. Try to reload the page or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    getTracksByTag(tag);
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "Trending") {
      navigate("/explore");
    } else {
      setSelectedLanguage(categoryId);
      const firstTag = tagsMap[categoryId]?.[0];
      if (firstTag) {
        getTracksByTag(firstTag);
      }
    }
  };

  // Add useEffect to handle scrolling when tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      // Only scroll on mobile screens
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Use a longer delay to ensure DOM is fully updated
        const timer = setTimeout(() => {
          const tracksSection = document.getElementById("tracks-section");
          if (tracksSection) {
            tracksSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [tracks]);

  useEffect(() => {
    if (tagsToDisplay?.length) {
      getTracksByTag(tagsToDisplay[0]);
    }
  }, [selectedLanguage]);

  return (
    <>
      <div style={{ backgroundColor: "#171717", minHeight: "100vh" }}>
        {/* Add smooth scrolling CSS */}
        <style>
          {`
            html {
              scroll-behavior: smooth;
            }
            
            @media (prefers-reduced-motion: no-preference) {
              * {
                scroll-behavior: smooth;
              }
            }
            
            /* Custom smooth scroll for older browsers */
            .smooth-scroll {
              transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slideInFromLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}
        </style>

        {/* Compact Browse Section */}
        <div
          className="container"
          style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
        >
          <div className="mb-3">
            <h2
              className="text-white fw-bold mb-1"
              style={{ fontSize: "1.25rem" }}
            >
              Browse Music
            </h2>
            <p className="text-white-50 mb-0" style={{ fontSize: "0.85rem" }}>
              Discover your favorites
            </p>
          </div>

          {/* Compact Category Cards Grid - Smaller on mobile */}
          <div className="row g-2 mb-3">
            {categoryCards.map((category) => (
              <div key={category.id} className="col-6 col-md-3">
                <div
                  className="position-relative overflow-hidden"
                  style={{
                    background: category.gradient,
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    height: window.innerWidth < 768 ? "80px" : "120px",
                    boxShadow: category.special
                      ? "0 6px 25px rgba(255, 50, 50, 0.6)" // stronger glow
                      : "0 4px 15px rgba(0, 0, 0, 0.3)",
                    border: category.special
                      ? "2px solid rgba(255,255,255,0.6)"
                      : "none", // 🔥 border for Trending
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0, 0, 0, 0.3)";
                  }}
                >
                  {/* Background Pattern */}
                  <div
                    className="position-absolute"
                    style={{
                      top: "-10px",
                      right: "-10px",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                  <div
                    className="position-absolute"
                    style={{
                      bottom: "-15px",
                      left: "-15px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.1)",
                    }}
                  />

                  <div className="p-2 h-100 d-flex flex-column justify-content-between position-relative">
                    <div className="d-flex align-items-center justify-content-between">
                      <span
                        style={{
                          fontSize:
                            window.innerWidth < 768 ? "1.2rem" : "1.5rem",
                        }}
                      >
                        {category.icon}
                      </span>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "rgba(255, 255, 255, 0.4)",
                        }}
                      />
                    </div>

                    <div>
                      <h3
                        className="text-white fw-bold mb-0"
                        style={{
                          fontSize:
                            window.innerWidth < 768 ? "0.85rem" : "1rem",
                          lineHeight: "1.2",
                        }}
                      >
                        {category.title}
                      </h3>
                      <p
                        className="text-white-75 mb-0"
                        style={{
                          fontSize:
                            window.innerWidth < 768 ? "0.7rem" : "0.75rem",
                          opacity: "0.9",
                        }}
                      >
                        {category.subtitle}
                      </p>
                      <p
                        className="text-white-50 mb-0"
                        style={{
                          fontSize:
                            window.innerWidth < 768 ? "0.65rem" : "0.7rem",
                          opacity: "0.7",
                        }}
                      >
                        {typeof category.count === "number"
                          ? `${category.count} options`
                          : category.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collapsible Quick Access Section */}
          <div
            className="p-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                cursor: window.innerWidth < 768 ? "pointer" : "default",
              }}
              onClick={() =>
                window.innerWidth < 768 &&
                setIsQuickAccessExpanded(!isQuickAccessExpanded)
              }
            >
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1rem" }}>
                  ⭐
                </span>
                <h3
                  className="text-white fw-semibold mb-0"
                  style={{ fontSize: "1rem" }}
                >
                  {selectedLanguage} Quick Access
                </h3>
              </div>
              {window.innerWidth < 768 && (
                <div className="text-white">
                  {isQuickAccessExpanded ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </div>
              )}
            </div>

            {/* Show first few tags on mobile when collapsed, all on desktop */}
            <div className="mt-2">
              <div className="d-flex flex-wrap gap-2">
                {(window.innerWidth < 768 && !isQuickAccessExpanded
                  ? tagsToDisplay?.slice(0, 4)
                  : tagsToDisplay
                )?.map((tag, index) => (
                  <button
                    key={index}
                    className="btn text-white border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      padding: "6px 12px",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(5px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    onClick={(e) => handleTagClick(e, tag)}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.2)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 5px 15px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Track Cards Section with ID for scrolling */}
        <main className="container my-3" id="tracks-section">
          {/* Results Header with smooth entrance animation */}
          {(tracks.length > 0 || loading || error) && (
            <div
              className="mb-3"
              style={{
                animation:
                  tracks.length > 0 ? "fadeInUp 0.6s ease-out" : "none",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <h3
                  className="text-white fw-semibold mb-0"
                  style={{
                    fontSize: "1.1rem",
                    animation:
                      tracks.length > 0
                        ? "slideInFromLeft 0.8s ease-out 0.2s both"
                        : "none",
                  }}
                >
                  {keyword && (
                    <>
                      <span className="me-2">🎵</span>
                      Results for "{keyword}"
                    </>
                  )}
                </h3>
                {tracks.length > 0 && (
                  <span
                    className="text-white-50"
                    style={{
                      fontSize: "0.85rem",
                      animation: "slideInFromLeft 0.8s ease-out 0.4s both",
                    }}
                  >
                    {tracks.length} tracks found
                  </span>
                )}
              </div>
              <hr
                style={{
                  border: "none",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  margin: "0.5rem 0",
                  animation:
                    tracks.length > 0
                      ? "fadeInUp 0.8s ease-out 0.3s both"
                      : "none",
                }}
              />
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center my-4" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center my-4">
              <div
                className="spinner-border"
                style={{ width: "2.5rem", height: "2.5rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {tracks.map((track, index) => {
                const cardId = `card-${index}`;

                return (
                  <div
                    className="col"
                    key={index}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div
                      id={cardId}
                      className="card h-100 modern-card position-relative"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "20px",
                        backdropFilter: "blur(20px)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                        e.currentTarget.style.border =
                          "1px solid rgba(255, 255, 255, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.border =
                          "1px solid rgba(255, 255, 255, 0.15)";
                      }}
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
                          borderRadius: "20px",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />

                      {/* Dynamic color reflection from image */}
                      <canvas
                        id={`canvas-${index}`}
                        width="1"
                        height="1"
                        style={{ display: "none" }}
                      />
                      <div
                        id={`reflection-${index}`}
                        className="position-absolute w-100 h-100"
                        style={{
                          borderRadius: "20px",
                          pointerEvents: "none",
                          opacity: 0.6,
                          zIndex: 0,
                          transition: "opacity 0.5s ease",
                        }}
                      />
                      <div
                        className="position-relative"
                        style={{ cursor: "pointer", zIndex: 2 }}
                        onClick={() => handlePlay(track, "home")}
                      >
                        <img
                          src={track.image[2].link}
                          className="card-img-top"
                          alt="cover"
                          crossOrigin="anonymous"
                          style={{
                            borderRadius: "20px 20px 0 0",
                            height: "200px",
                            objectFit: "cover",
                            transition: "all 0.3s ease",
                          }}
                          onLoad={(e) => {
                            // Extract colors from image for reflection effect
                            const img = e.target;
                            const canvas = document.getElementById(
                              `canvas-${index}`
                            );
                            const reflection = document.getElementById(
                              `reflection-${index}`
                            );

                            if (canvas && reflection) {
                              const ctx = canvas.getContext("2d");
                              canvas.width = img.naturalWidth || img.width;
                              canvas.height = img.naturalHeight || img.height;

                              try {
                                ctx.drawImage(
                                  img,
                                  0,
                                  0,
                                  canvas.width,
                                  canvas.height
                                );
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
                                radial-gradient(ellipse at center bottom, 
                                  rgba(${r}, ${g}, ${b}, 0.7) 0%,
                                  rgba(${r}, ${g}, ${b}, 0.5) 25%,
                                  rgba(${r}, ${g}, ${b}, 0.3) 50%,
                                  rgba(${r}, ${g}, ${b}, 0.15) 75%,
                                  transparent 100%
                                )
                              `;
                              } catch (error) {
                                // Fallback for CORS issues
                                reflection.style.background = `
                                radial-gradient(ellipse at center bottom, 
                                  rgba(100, 50, 200, 0.6) 0%,
                                  rgba(50, 100, 255, 0.4) 40%,
                                  rgba(255, 100, 150, 0.2) 70%,
                                  transparent 100%
                                )
                              `;
                              }
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.filter = "brightness(0.6)";
                            const playIcon =
                              e.target.parentNode.querySelector(".play-icon");
                            if (playIcon) playIcon.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.filter = "brightness(1)";
                            const playIcon =
                              e.target.parentNode.querySelector(".play-icon");
                            if (playIcon) playIcon.style.opacity = "0";
                          }}
                        />
                        <div
                          className="position-absolute top-50 start-50 translate-middle play-icon"
                          style={{
                            opacity: "0",
                            transition: "all 0.3s ease",
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            style={{
                              width: "70px",
                              height: "70px",
                              background: "rgba(255, 255, 255, 0.95)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow:
                                "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <FaPlay
                              style={{
                                color: "#333",
                                fontSize: "22px",
                                marginLeft: "4px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="card-body p-3"
                        style={{
                          background: "transparent",
                          color: "#fff",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1 me-3">
                            <h5
                              className="card-title mb-1"
                              style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#fff",
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: "2",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              {decodeHtmlEntities(track.name)}
                            </h5>
                            <div
                              className="card-text"
                              style={{
                                fontSize: "0.875rem",
                                color: "rgba(255, 255, 255, 0.8)",
                                display: "-webkit-box",
                                WebkitLineClamp: "1",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              {decodeHtmlEntities(track.primaryArtists)}
                            </div>
                          </div>

                          <button
                            className="btn p-0"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #ff1744, #e91e63)",
                              borderRadius: "50%",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              flexShrink: 0,
                              boxShadow:
                                "0 6px 20px rgba(255, 23, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addFavorite(track);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background =
                                "linear-gradient(135deg, #d50000, #c2185b)";
                              e.target.style.transform = "scale(1.1)";
                              e.target.style.boxShadow =
                                "0 8px 25px rgba(255, 23, 68, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background =
                                "linear-gradient(135deg, #ff1744, #e91e63)";
                              e.target.style.transform = "scale(1)";
                              e.target.style.boxShadow =
                                "0 6px 20px rgba(255, 23, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                            }}
                          >
                            <FaHeart
                              style={{
                                color: "white",
                                fontSize: "16px",
                                filter:
                                  "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default HomePage;
