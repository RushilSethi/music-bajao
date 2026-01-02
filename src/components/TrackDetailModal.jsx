import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlay, FaHeart, FaRegHeart, FaMusic, FaMicrophone, FaCalendar, FaClock, FaGlobe } from 'react-icons/fa';
import { useAppContext } from '../context/PlayerContext';

const TrackDetailModal = ({ trackId, isOpen, onClose }) => {
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handlePlay, addFavorite, removeFavorite, isFavorite, decodeHtmlEntities, normalizeSongData } = useAppContext();

  useEffect(() => {
    if (!isOpen || !trackId) return;

    const fetchTrackDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://saavn.sumit.co/api/songs/${trackId}`);
        if (!response.ok) throw new Error('Failed to fetch track details');
        const result = await response.json();
        if (result.success && result.data?.length > 0) {
          setTrackData(result.data[0]);
        } else {
          throw new Error('Invalid track data');
        }
      } catch (err) {
        console.error('Error fetching track:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId, isOpen]);

  if (!isOpen) return null;

  const isFav = trackData && isFavorite(trackData.id);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '88vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'rgba(20, 20, 35, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          scrollBehavior: 'smooth',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 71, 87, 0.15)',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            color: '#ff4757',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1,
            fontSize: '1.2rem',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 71, 87, 0.25)';
            e.target.style.transform = 'scale(1.1) rotate(90deg)';
            e.target.style.boxShadow = '0 8px 24px rgba(255, 71, 87, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 71, 87, 0.15)';
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <FaTimes />
        </button>

        {loading && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid #ff4757',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ marginTop: '1.5rem', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>Loading track details...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4757' }}>
            <p>❌ {error}</p>
          </div>
        )}

        {trackData && !loading && (
          <div style={{ padding: '2.5rem' }}>
            {/* Track Image with Gradient Background */}
            <div style={{
              marginBottom: '2rem',
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '320px',
                background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 107, 107, 0.1))',
                borderRadius: '50%',
                filter: 'blur(60px)',
                zIndex: 0,
              }} />
              <img
                src={trackData.image?.[2]?.url || trackData.image?.[2]?.link || trackData.image?.[1]?.url || trackData.image?.[0]?.url}
                alt={trackData.name}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '240px',
                  height: '240px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  boxShadow: '0 25px 50px rgba(255, 71, 87, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 35px 70px rgba(255, 71, 87, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 71, 87, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
              />
            </div>

            {/* Track Title & Artists */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '0.8rem',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '1.3',
              }}>
                {decodeHtmlEntities(trackData.name)}
              </h2>

              {trackData.artists?.primary?.length > 0 && (
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  textAlign: 'center',
                  marginBottom: '0rem',
                  fontWeight: '500',
                }}>
                  {trackData.artists.primary.map(artist => decodeHtmlEntities(artist.name)).join(', ')}
                </p>
              )}

              {trackData.artists?.featured?.length > 0 && (
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  marginTop: '0.3rem',
                }}>
                  feat. {trackData.artists.featured.map(artist => decodeHtmlEntities(artist.name)).join(', ')}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => {
                  const normalizedTrack = normalizeSongData ? normalizeSongData(trackData) : trackData;
                  handlePlay(normalizedTrack, 'home');
                }}
                style={{
                  background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 20px rgba(255, 71, 87, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(255, 71, 87, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 20px rgba(255, 71, 87, 0.3)';
                }}
              >
                <FaPlay size={14} /> Play
              </button>

              <button
                onClick={() => {
                  if (isFav) {
                    removeFavorite(trackData.id);
                  } else {
                    const normalizedTrack = normalizeSongData ? normalizeSongData(trackData) : trackData;
                    addFavorite(normalizedTrack);
                  }
                }}
                style={{
                  background: isFav ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: `1.5px solid ${isFav ? 'rgba(255, 71, 87, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: isFav ? '#ff4757' : 'rgba(255, 255, 255, 0.7)',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = isFav ? 'rgba(255, 71, 87, 0.3)' : 'rgba(255, 255, 255, 0.12)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.color = '#ff4757';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = isFav ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 255, 255, 0.08)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = isFav ? '#ff4757' : 'rgba(255, 255, 255, 0.7)';
                }}
              >
                {isFav ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                {isFav ? 'Liked' : 'Like'}
              </button>
            </div>

            {/* Track Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {trackData.album && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
                >
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 71, 87, 0.8)',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}><FaMusic size={12} /> Album</p>
                  <p style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {decodeHtmlEntities(trackData.album.name)}
                  </p>
                </div>
              )}

              {trackData.duration && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
                >
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 71, 87, 0.8)',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}><FaClock size={12} /> Duration</p>
                  <p style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                  }}>
                    {Math.floor(trackData.duration / 60)}:{String(trackData.duration % 60).padStart(2, '0')}
                  </p>
                </div>
              )}

              {trackData.language && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
                >
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 71, 87, 0.8)',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}><FaGlobe size={12} /> Language</p>
                  <p style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    textTransform: 'capitalize',
                  }}>
                    {trackData.language}
                  </p>
                </div>
              )}

              {trackData.year && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
                >
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 71, 87, 0.8)',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}><FaCalendar size={12} /> Year</p>
                  <p style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                  }}>
                    {trackData.year}
                  </p>
                </div>
              )}

              {trackData.playCount && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
                >
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 71, 87, 0.8)',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>Plays</p>
                  <p style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                  }}>
                    {(trackData.playCount / 1000000).toFixed(1)}M
                  </p>
                </div>
              )}
            </div>

            {/* Copyright Info */}
            {trackData.copyright && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '2rem',
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  lineHeight: '1.6',
                }}>
                  © {trackData.copyright}
                </p>
              </div>
            )}

            {/* Primary Artists Section */}
            {trackData.artists?.primary?.length > 0 && (
              <div style={{
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}><FaMicrophone size={16} /> Main Artists</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '1rem',
                }}>
                  {trackData.artists.primary.map(artist => (
                    <div
                      key={artist.id}
                      style={{
                        textAlign: 'center',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {artist.image && artist.image.length > 0 && (
                        <img
                          src={artist.image[2]?.url || artist.image[2]?.link || artist.image[1]?.url || artist.image[0]?.url}
                          alt={artist.name}
                          style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '0.7rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            border: '2px solid rgba(255, 255, 255, 0.15)',
                          }}
                        />
                      )}
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#fff',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {decodeHtmlEntities(artist.name)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Artists Section */}
            {trackData.artists?.featured?.length > 0 && (
              <div style={{
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}><FaMicrophone size={16} /> Featured Artists</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '1rem',
                }}>
                  {trackData.artists.featured.map(artist => (
                    <div
                      key={artist.id}
                      style={{
                        textAlign: 'center',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {artist.image && artist.image.length > 0 && (
                        <img
                          src={artist.image[2]?.url || artist.image[2]?.link || artist.image[1]?.url || artist.image[0]?.url}
                          alt={artist.name}
                          style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '0.7rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            border: '2px solid rgba(255, 255, 255, 0.15)',
                          }}
                        />
                      )}
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#fff',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {decodeHtmlEntities(artist.name)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TrackDetailModal;
