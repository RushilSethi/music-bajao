import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaHeart, FaRegHeart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useAppContext } from '../context/PlayerContext';

const ArtistAlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const {
    handlePlay,
    addFavorite,
    removeFavorite,
    favorites,
  } = useAppContext();

  const [data, setData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const albumRes = await fetch(`https://saavn.sumit.co/api/albums?id=${albumId}`);
        if (!albumRes.ok) throw new Error(`Album not found: ${albumRes.status}`);
        const albumData = await albumRes.json();
        
        if (albumData.success && albumData.data) {
          setData(albumData.data);

          if (albumData.data.songs) {
            const mappedSongs = (albumData.data.songs || []).map(song => {
              // Map downloadUrl array to numeric indices
              const downloadUrlObj = {};
              
              if (song.downloadUrl && Array.isArray(song.downloadUrl)) {
                song.downloadUrl.forEach((dl, index) => {
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
          }
        } else {
          setError('Invalid album data structure');
        }
      } catch (err) {
        console.error('Error fetching album details:', err);
        setError(err.message || 'Failed to load album');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumDetails();
    }
  }, [albumId]);

  const decodeHtmlEntities = (str) => {
    if (!str) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  const handleFavoriteToggle = (track, e) => {
    e.stopPropagation();
    const isFavorited = favorites.some((fav) => fav.id === track.id);
    if (isFavorited) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FaSpinner className="fa-spin mb-3" style={{ fontSize: '3rem', color: 'rgba(255, 255, 255, 0.5)' }} />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading album...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4" style={{ maxWidth: '1200px' }}>
        <div className="text-center py-5" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <h3 className="mb-3" style={{ color: '#fff' }}>Error Loading Album</h3>
          <p>{error}</p>
          <button
            className="btn"
            onClick={() => navigate(-1)}
            style={{
              background: 'linear-gradient(135deg, #ff4757, #ff3742)',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              marginTop: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <FaArrowLeft className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '1200px' }}>
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Artist
        </button>
      </div>

      {/* Album Header with Background Image Effect */}
      {data && (
        <div style={{
          marginBottom: '4rem',
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
        }}>
          {/* Background blur effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 23, 68, 0.1) 50%, rgba(63, 81, 181, 0.1) 100%)`,
            zIndex: 0,
            filter: 'blur(30px)',
          }} />

          <div className="row align-items-center" style={{ position: 'relative', zIndex: 1, padding: '3rem 0' }}>
            <div className="col-lg-3 mb-4 mb-lg-0 text-center text-lg-start" style={{ paddingLeft: '1rem' }}>
              <div style={{
                width: '220px',
                height: '220px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(255, 71, 87, 0.4), 0 0 40px rgba(255, 71, 87, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                margin: '0 auto 0 0',
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.2) 0%, rgba(63, 81, 181, 0.2) 100%)',
              }}>
                <img
                  src={data.image?.[2]?.url || data.image?.[1]?.url || data.image?.[0]?.url}
                  alt={data.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>

            <div className="col-lg-9">
              <div className="mb-3">
                <span style={{
                  fontSize: '0.8rem',
                  color: '#ff4757',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}>
                  🎵 Album from Artist
                </span>
              </div>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                color: '#fff',
                textShadow: '0 2px 10px rgba(255, 71, 87, 0.3)',
              }}>
                {decodeHtmlEntities(data.name)}
              </h1>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '2rem',
                fontSize: '0.95rem',
              }}>
                {data.primaryArtists && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600', fontSize: '0.85rem' }}>PRIMARY ARTIST</span>
                    <p style={{ margin: '0.75rem 0 0 0', color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                      {data.primaryArtists}
                    </p>
                  </div>
                )}
                {data.year && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600', fontSize: '0.85rem' }}>RELEASE YEAR</span>
                    <p style={{ margin: '0.75rem 0 0 0', color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                      {data.year}
                    </p>
                  </div>
                )}
                {tracks.length > 0 && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600', fontSize: '0.85rem' }}>TOTAL SONGS</span>
                    <p style={{ margin: '0.75rem 0 0 0', color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                      {tracks.length} Tracks
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracks Section */}
      {tracks.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            🎼 Tracklist
          </h2>

          <div className='px-3' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tracks.map((track, index) => {
              const isFavorited = favorites.some((fav) => fav.id === track.id);
              return (
                <div
                  key={track.id}
                  className="row align-items-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  {/* Track Index */}
                  <div className="col-auto" style={{ minWidth: '50px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: '700',
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Album Thumbnail */}
                  <div className="col-auto" style={{ marginRight: '1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(63, 81, 181, 0.2))',
                    }}>
                      <img
                        src={track.image?.[2]?.url || track.image?.[1]?.url || track.image?.[0]?.url}
                        alt={track.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="col" onClick={() => handlePlay(track, 'playlist', { id: data.id, name: data.name, tracks })} style={{ cursor: 'pointer', minWidth: 0 }}>
                    <div className="card-body" style={{ background: 'transparent', padding: '0.5rem 0' }}>
                      <h6 style={{
                        color: '#fff',
                        fontWeight: '700',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.95rem',
                      }}>
                        {decodeHtmlEntities(track.name)}
                      </h6>
                      <small style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        fontWeight: '500',
                      }}>
                        {decodeHtmlEntities(track.primaryArtists)}
                      </small>
                    </div>
                  </div>

                  {/* Duration & Actions */}
                  <div className="col-auto d-flex justify-content-end align-items-center gap-2">
                    <span style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: '600',
                      minWidth: '45px',
                      textAlign: 'right',
                    }}>
                      {Math.floor(track.duration / 60)}:
                      {String(track.duration % 60).padStart(2, '0')}
                    </span>

                    <button
                      className="btn btn-sm p-2"
                      style={{
                        background: isFavorited
                          ? 'linear-gradient(135deg, #ff4757, #ff3742)'
                          : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: isFavorited ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '6px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isFavorited
                          ? '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => handleFavoriteToggle(track, e)}
                      onMouseEnter={(e) => {
                        if (isFavorited) {
                          e.target.style.background = 'linear-gradient(135deg, #ff3742, #ff2d3a)';
                          e.target.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                        } else {
                          e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                        }
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (isFavorited) {
                          e.target.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                          e.target.style.boxShadow = '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        } else {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                        }
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {isFavorited ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <button
                      className="btn btn-sm p-2"
                      style={{
                        background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePlay(track, 'playlist')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff3742, #ff2d3a)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 71, 87, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FaPlay style={{ fontSize: '0.8rem' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tracks.length === 0 && !loading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>No tracks available for this album.</p>
        </div>
      )}
    </div>
  );
};

export default ArtistAlbumPage;
