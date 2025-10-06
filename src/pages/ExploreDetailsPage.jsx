import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/PlayerContext";
import { FaPlay, FaHeart, FaSearch, FaClock, FaMusic, FaRegHeart, FaSpinner, FaUser, FaCompactDisc } from "react-icons/fa";
const ExploreDetailsPage = () => {
  const params = useParams();
  const { id } = params;
  
  const pathname = window.location.pathname;
  const type = pathname.includes('/album/') ? 'album' : pathname.includes('/artist/') ? 'artist' : null;
  
  const {
    handlePlay,
    favorites,
    addFavorite,
    removeFavorite,
    truncateText,
  } = useAppContext();
  const [data, setData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      setTracks([]);
      
      if (!type || !id) {
        setError(`Missing ${!type ? 'type' : 'id'} parameter.`);
        setLoading(false);
        return;
      }
      
      try {
        if (type === "album") {
          const response = await fetch(`https://saavn.dev/api/albums?id=${id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const result = await response.json();
          
          if (result.success && result.data) {
            setData(result.data);
            const mappedSongs = (result.data.songs || []).map(song => {
              // Map downloadUrl array to numeric indices only
              const downloadUrlObj = {};
              
              if (song.downloadUrl && Array.isArray(song.downloadUrl)) {
                song.downloadUrl.forEach((dl, index) => {
                  // Store by numeric index (0, 1, 2, 3, 4)
                  downloadUrlObj[index] = { link: dl.url };
                });
              }
              
              // Keep image as array with proper structure
              const imageArray = (song.image || []).map(img => ({
                quality: img.quality,
                link: img.url,
                url: img.url
              }));
              return {
                id: song.id,
                name: song.name,
                duration: song.duration || 0,
                image: imageArray,
                primaryArtists: song.artists?.primary?.map(a => a.name).join(", ") || "Unknown Artist",
                downloadUrl: downloadUrlObj,
                album: song.album,
                artists: song.artists,
                type: song.type || "song",
                year: song.year,
                language: song.language,
                url: song.url,
                playCount: song.playCount
              };
            });
            setTracks(mappedSongs);
          } else {
            throw new Error("Invalid album data");
          }
          
        } else if (type === "artist") {
          const [songsResponse, artistResponse] = await Promise.all([
            fetch(`https://saavn.dev/api/artists/${id}/songs?page=0&sortBy=popularity&sortOrder=desc`),
            fetch(`https://saavn.dev/api/artists/${id}?page=0&songCount=10&albumCount=10&sortBy=popularity&sortOrder=desc`)
          ]);
          
          if (!songsResponse.ok || !artistResponse.ok) {
            throw new Error('Failed to fetch artist data');
          }
          
          const [songsResult, artistResult] = await Promise.all([
            songsResponse.json(),
            artistResponse.json()
          ]);
          
          if (songsResult.success && songsResult.data?.songs) {
            const mappedSongs = songsResult.data.songs.map(song => {
              // Map downloadUrl array to numeric indices only
              const downloadUrlObj = {};
              
              if (song.downloadUrl && Array.isArray(song.downloadUrl)) {
                song.downloadUrl.forEach((dl, index) => {
                  // Store by numeric index (0, 1, 2, 3, 4)
                  downloadUrlObj[index] = { link: dl.url };
                });
              }
              
              // Keep image as array with proper structure
              const imageArray = (song.image || []).map(img => ({
                quality: img.quality,
                link: img.url,
                url: img.url
              }));
              return {
                id: song.id,
                name: song.name,
                duration: song.duration || 0,
                image: imageArray,
                primaryArtists: song.artists?.primary?.map(a => a.name).join(", ") || "Unknown Artist",
                downloadUrl: downloadUrlObj,
                album: song.album,
                artists: song.artists,
                type: song.type || "song",
                year: song.year,
                language: song.language,
                url: song.url,
                playCount: song.playCount
              };
            });
            setTracks(mappedSongs);
            setData(artistResult.success ? artistResult.data : { name: "Unknown Artist" });
          } else {
            throw new Error("Invalid artist data");
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);
  const isFavorite = (trackId) => favorites.some(fav => fav.id === trackId);
  const handleFavoriteToggle = (track, e) => {
    e.stopPropagation();
    isFavorite(track.id) ? removeFavorite(track.id) : addFavorite(track);
  };
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return tracks;
    return tracks.filter(track => 
      track.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.primaryArtists?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tracks, searchQuery]);
  const totalDuration = useMemo(() => {
    const totalSeconds = tracks.reduce((sum, track) => sum + parseInt(track.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [tracks]);
  const renderTrackCard = (track, index) => {
    const favorited = isFavorite(track.id);
    const cardId = `track-card-${index}`;
    
    return (
      <div
        key={track.id || index}
        id={cardId}
        className="card mb-3 position-relative"
        style={{ 
          cursor: "pointer",
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        }}
        onClick={() => handlePlay(track, type === 'album' ? 'album' : 'artist')}
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
            borderRadius: '16px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Dynamic color reflection from image */}
        <canvas
          id={`track-canvas-${index}`}
          width="1"
          height="1"
          style={{ display: 'none' }}
        />
        <div
          id={`track-reflection-${index}`}
          className="position-absolute w-100 h-100"
          style={{
            borderRadius: '16px',
            pointerEvents: 'none',
            opacity: 0.5,
            zIndex: 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        <div className="row g-0 h-100" style={{ position: 'relative', zIndex: 2 }}>
          <div className="col-4 col-md-3 position-relative">
            <div
              className="position-relative h-100"
              style={{
                overflow: 'hidden',
                borderRadius: '16px 0 0 16px',
                minHeight: '120px',
              }}
            >
              <img
                src={track.image?.[2]?.link || track.image?.[1]?.link || track.image?.[0]?.link}
                className="img-fluid w-100 h-100"
                alt={track.name}
                crossOrigin="anonymous"
                style={{
                  objectFit: "cover",
                  transition: 'all 0.3s ease',
                }}
                onLoad={(e) => {
                  // Extract colors from image for reflection effect
                  const img = e.target;
                  const canvas = document.getElementById(`track-canvas-${index}`);
                  const reflection = document.getElementById(`track-reflection-${index}`);

                  if (canvas && reflection) {
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;

                    try {
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      const data = imageData.data;

                      let r = 0, g = 0, b = 0;
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
                  e.target.style.filter = 'brightness(0.7) contrast(1.1)';
                  const playOverlay = e.target.parentNode.querySelector('.play-overlay');
                  if (playOverlay) playOverlay.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = 'brightness(1) contrast(1)';
                  const playOverlay = e.target.parentNode.querySelector('.play-overlay');
                  if (playOverlay) playOverlay.style.opacity = '0';
                }}
              />
              
              {/* Play overlay on hover */}
              <div 
                className="position-absolute top-50 start-50 translate-middle play-overlay"
                style={{
                  opacity: '0',
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <FaPlay style={{ color: '#333', fontSize: '16px', marginLeft: '2px' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-8 col-md-9 d-flex flex-column justify-content-between">
            <div className="card-body" style={{ background: 'transparent' }}>
              <h5
                className="card-title"
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  marginBottom: '8px',
                }}
              >
                {track.name}
              </h5>
              <p
                className="card-text"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                  marginBottom: '6px',
                }}
              >
                {truncateText(track.primaryArtists, 25)}
              </p>
              <p
                className="card-text"
                style={{
                  marginBottom: '0',
                }}
              >
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  <FaClock className="me-1" />
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </small>
              </p>
            </div>
            
            <div
              className="card-footer d-flex justify-content-end"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
              }}
            >
              <button
                className="btn btn-sm"
                style={{
                  background: favorited ? 'linear-gradient(135deg, #ff4757, #ff3742)' : 'rgba(255, 255, 255, 0.1)',
                  border: favorited ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px 16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: favorited
                    ? '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={(e) => handleFavoriteToggle(track, e)}
                onMouseEnter={(e) => {
                  if (favorited) {
                    e.target.style.background = 'linear-gradient(135deg, #ff3742, #ff2d3a)';
                    e.target.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                  } else {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                  }
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (favorited) {
                    e.target.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                    e.target.style.boxShadow = '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  } else {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                  }
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {favorited ? <FaHeart className="me-1" /> : <FaRegHeart className="me-1" />}
                {favorited ? "Remove" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="container py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FaSpinner className="fa-spin mb-3" style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.5)' }} />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading {type}...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-4" style={{ maxWidth: '1200px' }}>
        <div className="text-center py-5" style={{
          background: 'rgba(255, 71, 87, 0.1)',
          border: '1px solid rgba(255, 71, 87, 0.3)',
          borderRadius: '16px',
        }}>
          <h3 style={{ color: '#ff4757', marginBottom: '0.5rem' }}>
            Error Loading {type === 'album' ? 'Album' : 'Artist'}
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{error}</p>
        </div>
      </div>
    );
  }
  // ARTIST VIEW
  if (type === 'artist') {
    return (
      <div className="container py-4" style={{ maxWidth: '1200px' }}>
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 mb-4">
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '4px solid rgba(255, 255, 255, 0.1)',
              }}>
                <img
                  src={data?.image?.[2]?.url || data?.image?.[1]?.url || data?.image?.[0]?.url}
                  alt={data?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="flex-grow-1">
                <div className="mb-2">
                  <span style={{
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {data?.isVerified ? '✓ Verified Artist' : 'Artist'}
                  </span>
                </div>
                <h1 style={{
                  fontSize: '3.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #fff, #e1e8ed)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}>
                  {data?.name}
                </h1>
                <div className="d-flex flex-wrap gap-4">
                  <div>
                    <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>
                      {data?.followerCount?.toLocaleString() || '0'}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Followers</div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>
                      {data?.fanCount?.toLocaleString() || '0'}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Fans</div>
                  </div>
                  {data?.dominantLanguage && (
                    <div>
                      <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', textTransform: 'capitalize' }}>
                        {data.dominantLanguage}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Primary Language</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {data?.topAlbums && data.topAlbums.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Top Albums
              </h2>
              <div className="row g-3">
                {data.topAlbums.slice(0, 6).map((album) => (
                  <div key={album.id} className="col-6 col-md-4 col-lg-2">
                    <div
                      style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                      onClick={() => window.location.href = `/album/${album.id}`}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '0.75rem',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                      }}>
                        <img
                          src={album.image?.[2]?.url || album.image?.[1]?.url || album.image?.[0]?.url}
                          alt={album.name}
                          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                        />
                      </div>
                      <h6 style={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {album.name}
                      </h6>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginBottom: '0' }}>
                        {album.year || 'Album'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700', marginBottom: '0' }}>
                Popular Songs
              </h2>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 translate-middle-y ms-3" 
                    style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', zIndex: 2 }} 
                  />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#fff',
                      padding: '12px 20px 12px 45px',
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-5" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
              }}>
                <FaMusic style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '1rem' }} />
                <h3 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {searchQuery ? 'No songs found' : 'No songs available'}
                </h3>
              </div>
            ) : (
              <div className="row g-3">
                {filteredTracks.map((track, index) => (
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
  }
  // ALBUM VIEW
  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              }}>
                <FaCompactDisc style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <div>
                <h1 className="mb-0" style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fff, #e1e8ed)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {data?.name || data?.title}
                </h1>
                <p className="mb-0 mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
                  by {data?.artists?.primary?.map(a => a.name).join(", ") || 'Various Artists'}
                </p>
              </div>
            </div>
            <div className="d-flex gap-3 p-3" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
            }}>
              <div className="text-center">
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>{tracks.length}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                  <FaMusic className="me-1" />Songs
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
              <div className="text-center">
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>{totalDuration}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                  <FaClock className="me-1" />Duration
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 translate-middle-y ms-3"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', zIndex: 2 }}
                />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '12px 20px 12px 45px',
                    backdropFilter: 'blur(20px)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-5" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
            }}>
              {searchQuery ? (
                <>
                  <FaSearch style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No songs found</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Try adjusting your search terms</p>
                </>
              ) : (
                <>
                  <FaMusic style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No songs available</h3>
                </>
              )}
            </div>
          ) : (
            <div className="row g-3">
              {filteredTracks.map((track, index) => (
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
export default ExploreDetailsPage;