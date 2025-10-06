import React, { useState } from "react";
import { FaSearch, FaCompactDisc, FaUser, FaPlay, FaCalendarAlt, FaMusic, FaFilter, FaTimes, FaThumbtack, FaEye, FaHeart, FaPlayCircle } from "react-icons/fa";

const MusicSearchPage = ({ onNavigateToDetail = (type, id) => console.log(`Navigate to ${type}/${id}`) }) => {
  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  // Load pinned items from localStorage
  const loadPinnedFromStorage = () => {
    try {
      const stored = localStorage.getItem('pinned');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading pinned items:', error);
    }
    return { albums: [], artists: [] };
  };

  // Save pinned items to localStorage
  const savePinnedToStorage = (pinnedItems) => {
    try {
      localStorage.setItem('pinned', JSON.stringify(pinnedItems));
    } catch (error) {
      console.error('Error saving pinned items:', error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [albumResults, setAlbumResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, albums, artists
  const [showFilters, setShowFilters] = useState(false);
  const [pinnedItems, setPinnedItems] = useState(loadPinnedFromStorage);
  const [pinnedFilter, setPinnedFilter] = useState("all"); // all, albums, artists for pinned section

  // Check if an item is pinned
  const isPinned = (item, type) => {
    return pinnedItems[type].some(pinned => pinned.id === item.id);
  };

  // Toggle pin status
  const togglePin = (item, type) => {
    const currentItems = [...pinnedItems[type]];
    const existingIndex = currentItems.findIndex(pinned => pinned.id === item.id);
    
    if (existingIndex >= 0) {
      // Unpin: remove from array
      currentItems.splice(existingIndex, 1);
    } else {
      // Pin: add to array
      currentItems.push(item);
    }
    
    const newPinnedItems = {
      ...pinnedItems,
      [type]: currentItems
    };
    
    setPinnedItems(newPinnedItems);
    savePinnedToStorage(newPinnedItems);
  };

  // Handle navigation to detail page
  const handleItemClick = (item, type) => {
    const itemType = type === 'artists' ? 'artist' : 'album';
    onNavigateToDetail(itemType, item.id);
  };

  // Search for albums
  const searchAlbums = async (query) => {
    try {
      const response = await fetch(`https://saavn.dev/api/search/albums?query=${encodeURIComponent(query)}&page=0&limit=12`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.results || [];
      }
      return [];
    } catch (error) {
      console.error("Error searching albums:", error);
      return [];
    }
  };

  // Search for artists
  const searchArtists = async (query) => {
    try {
      const response = await fetch(`https://saavn.dev/api/search/artists?query=${encodeURIComponent(query)}&page=0&limit=12`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.results || [];
      }
      return [];
    } catch (error) {
      console.error("Error searching artists:", error);
      return [];
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const [albums, artists] = await Promise.all([
        searchAlbums(searchQuery),
        searchArtists(searchQuery)
      ]);
      
      setAlbumResults(albums);
      setArtistResults(artists);
    } finally {
      setLoading(false);
    }
  };

  const renderPinButton = (item, type) => (
    <button
      className="position-absolute"
      onClick={(e) => {
        e.stopPropagation();
        togglePin(item, type);
      }}
      style={{
        top: '16px',
        right: '16px',
        background: isPinned(item, type) 
          ? 'linear-gradient(135deg, #dc3545, #c82333)' 
          : 'rgba(0, 0, 0, 0.7)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        zIndex: 3,
        boxShadow: isPinned(item, type) 
          ? '0 6px 20px rgba(220, 53, 69, 0.4)' 
          : '0 4px 12px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1) rotate(-10deg)';
        e.target.style.boxShadow = isPinned(item, type) 
          ? '0 8px 25px rgba(220, 53, 69, 0.5)' 
          : '0 6px 16px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1) rotate(0deg)';
        e.target.style.boxShadow = isPinned(item, type) 
          ? '0 6px 20px rgba(220, 53, 69, 0.4)' 
          : '0 4px 12px rgba(0, 0, 0, 0.4)';
      }}
    >
      <FaThumbtack 
        style={{ 
          transform: isPinned(item, type) ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} 
      />
    </button>
  );

  // Unified card design for both artists and albums
  const renderUnifiedCard = (item, type, index, showPinButton = true) => (
    <div
      key={`${type}-${item.id}`}
      className="position-relative"
      style={{
        cursor: "pointer",
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '20px',
        textAlign: 'center',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.border = type === 'artists' 
          ? '1px solid rgba(255, 133, 27, 0.5)'
          : '1px solid rgba(40, 167, 69, 0.5)';
        e.currentTarget.style.background = type === 'artists'
          ? 'linear-gradient(145deg, rgba(255, 133, 27, 0.15), rgba(255, 255, 255, 0.05))'
          : 'linear-gradient(145deg, rgba(40, 167, 69, 0.15), rgba(255, 255, 255, 0.05))';
        
        // Show action button
        const actionBtn = e.currentTarget.querySelector('.card-action-btn');
        if (actionBtn) {
          actionBtn.style.opacity = '1';
          actionBtn.style.transform = 'translateY(0)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
        
        // Hide action button
        const actionBtn = e.currentTarget.querySelector('.card-action-btn');
        if (actionBtn) {
          actionBtn.style.opacity = '0';
          actionBtn.style.transform = 'translateY(8px)';
        }
      }}
      onClick={() => handleItemClick(item, type)}
    >
      {/* Pin Button */}
      {showPinButton && renderPinButton(item, type)}

      {/* Type indicator */}
      <div 
        className="position-absolute"
        style={{
          top: '16px',
          left: '16px',
          background: type === 'artists' 
            ? 'linear-gradient(135deg, #ff851b, #ff6b35)'
            : 'linear-gradient(135deg, #28a745, #20c997)',
          borderRadius: '12px',
          padding: '6px 10px',
          fontSize: '0.7rem',
          fontWeight: '700',
          color: 'white',
          boxShadow: type === 'artists'
            ? '0 4px 16px rgba(255, 133, 27, 0.4)'
            : '0 4px 16px rgba(40, 167, 69, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 99,
        }}
      >
        {type === 'artists' ? (
          <><FaUser className="me-1" style={{ fontSize: '0.6rem' }} />Artist</>
        ) : (
          <><FaCompactDisc className="me-1" style={{ fontSize: '0.6rem' }} />Album</>
        )}
      </div>

      {/* Image */}
      <div 
        className="position-relative mb-3"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: type === 'artists' ? '50%' : '12px',
          overflow: 'hidden',
          border: '3px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
        }}
      >
        <img
          src={item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url}
          className="w-100 h-100"
          alt={item.name}
          style={{ 
            objectFit: "cover",
            transition: 'all 0.4s ease'
          }}
        />
        
        {/* Play overlay for albums */}
        {type === 'albums' && (
          <div 
            className="position-absolute top-50 start-50 translate-middle"
            style={{
              opacity: '0',
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaPlay 
                style={{ 
                  color: '#333', 
                  fontSize: '14px',
                  marginLeft: '2px'
                }} 
              />
            </div>
          </div>
        )}
      </div>

      <div className="position-relative z-1 flex-grow-1 d-flex flex-column justify-content-between">
        <div>
          <h5 
            className="mb-1"
            style={{
              color: '#fff',
              fontWeight: '700',
              fontSize: '1.1rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              lineHeight: '1.2',
              marginBottom: '6px'
            }}
          >
            {item.name}
          </h5>
          
          {type === 'albums' && (
            <p 
              className="mb-2"
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.85rem',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                fontWeight: '500'
              }}
            >
              {item.artists?.primary?.map(artist => artist.name).join(", ") || "Various Artists"}
            </p>
          )}
          
          {type === 'artists' && (
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.85rem',
                margin: '0 0 8px 0',
                fontWeight: '500'
              }}
            >
              Explore Discography
            </p>
          )}
        </div>
        
        <div className="d-flex flex-column align-items-center">
          {/* Action button */}
          <div 
            className="card-action-btn"
            style={{
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'all 0.3s ease'
            }}
          >
            <button
              style={{
                background: type === 'artists'
                  ? 'linear-gradient(135deg, #ff851b, #ff6b35)'
                  : 'linear-gradient(135deg, #28a745, #20c997)',
                border: 'none',
                borderRadius: '16px',
                color: 'white',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: type === 'artists'
                  ? '0 3px 12px rgba(255, 133, 27, 0.3)'
                  : '0 3px 12px rgba(40, 167, 69, 0.3)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item, type);
              }}
            >
              {type === 'artists' ? (
                <><FaPlayCircle style={{ fontSize: '0.7rem' }} />View Artist</>
              ) : (
                <><FaPlay style={{ fontSize: '0.7rem' }} />Play Album</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Compact table-like row renderers
  const renderCompactArtistRow = (artist, index) => (
    <div
      key={`artist-row-${artist.id}`}
      className="d-flex align-items-center py-3 px-4 mb-2 position-relative"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        minHeight: '70px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 133, 27, 0.08)';
        e.currentTarget.style.border = '1px solid rgba(255, 133, 27, 0.2)';
        e.currentTarget.style.transform = 'translateX(6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onClick={() => handleItemClick(artist, 'artists')}
    >
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePin(artist, 'artists');
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: isPinned(artist, 'artists') 
            ? 'linear-gradient(135deg, #dc3545, #c82333)' 
            : 'rgba(255, 255, 255, 0.08)',
          border: 'none',
          borderRadius: '6px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.7rem',
          transition: 'all 0.3s ease'
        }}
      >
        <FaThumbtack style={{ transform: isPinned(artist, 'artists') ? 'rotate(45deg)' : 'rotate(0deg)' }} />
      </button>

      <div className="me-3">
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <img
            src={artist.image?.[1]?.url || artist.image?.[0]?.url}
            alt={artist.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      <div className="flex-grow-1 me-3">
        <div className="d-flex align-items-center mb-1">
          <div
            className="me-2"
            style={{
              background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.65rem',
              fontWeight: '600',
              color: 'white'
            }}
          >
            <FaUser className="me-1" style={{ fontSize: '0.5rem' }} />
            ARTIST
          </div>
        </div>
        
        <h6 style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px' }}>
          {artist.name}
        </h6>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', margin: 0 }}>
          Explore discography
        </p>
      </div>

      <div>
        <button
          style={{
            background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleItemClick(artist, 'artists');
          }}
        >
          <FaPlayCircle style={{ fontSize: '0.7rem' }} />
          View
        </button>
      </div>
    </div>
  );

  const renderCompactAlbumRow = (album, index) => (
    <div
      key={`album-row-${album.id}`}
      className="d-flex align-items-center py-3 px-4 mb-2 position-relative"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        minHeight: '70px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(40, 167, 69, 0.08)';
        e.currentTarget.style.border = '1px solid rgba(40, 167, 69, 0.2)';
        e.currentTarget.style.transform = 'translateX(6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onClick={() => handleItemClick(album, 'albums')}
    >
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePin(album, 'albums');
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: isPinned(album, 'albums') 
            ? 'linear-gradient(135deg, #dc3545, #c82333)' 
            : 'rgba(255, 255, 255, 0.08)',
          border: 'none',
          borderRadius: '6px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.7rem',
          transition: 'all 0.3s ease'
        }}
      >
        <FaThumbtack style={{ transform: isPinned(album, 'albums') ? 'rotate(45deg)' : 'rotate(0deg)' }} />
      </button>

      <div className="me-3">
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <img
            src={album.image?.[1]?.url || album.image?.[0]?.url}
            alt={album.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      <div className="flex-grow-1 me-3">
        <div className="d-flex align-items-center mb-1">
          <div
            className="me-2"
            style={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.65rem',
              fontWeight: '600',
              color: 'white'
            }}
          >
            <FaCompactDisc className="me-1" style={{ fontSize: '0.5rem' }} />
            ALBUM
          </div>
          {album.year && (
            <span
              style={{
                background: 'rgba(40, 167, 69, 0.15)',
                color: 'rgba(40, 167, 69, 0.9)',
                borderRadius: '4px',
                padding: '1px 6px',
                fontSize: '0.65rem',
                fontWeight: '500'
              }}
            >
              {album.year}
            </span>
          )}
        </div>
        
        <h6 style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px' }}>
          {album.name}
        </h6>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', margin: 0 }}>
          {album.artists?.primary?.map(artist => artist.name).join(", ") || "Various Artists"}
        </p>
      </div>

      <div>
        <button
          style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleItemClick(album, 'albums');
          }}
        >
          <FaPlay style={{ fontSize: '0.7rem' }} />
          Play
        </button>
      </div>
    </div>
  );

  const totalResults = albumResults.length + artistResults.length;
  const totalPinned = pinnedItems.albums.length + pinnedItems.artists.length;

  return (
    <div className="container py-4" style={{ maxWidth: '1400px' }}>
      {/* Compact Pinned Section */}
      {totalPinned > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <div 
                  className="me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)',
                  }}
                >
                  <FaThumbtack style={{ color: 'white', fontSize: '12px', transform: 'rotate(45deg)' }} />
                </div>
                <h4 
                  className="mb-0 me-3"
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}
                >
                  Pinned
                </h4>
                <span 
                  className="px-2 py-1"
                  style={{
                    background: 'rgba(220, 53, 69, 0.2)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '12px',
                    color: '#dc3545',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {totalPinned}
                </span>
              </div>

              {/* Inline Filter Buttons */}
              <div className="d-flex gap-2">
                {["all", "artists", "albums"].map((filter) => (
                  <button
                    key={filter}
                    className={`btn btn-sm ${pinnedFilter === filter ? 'active' : ''}`}
                    onClick={() => setPinnedFilter(filter)}
                    style={{
                      background: pinnedFilter === filter 
                        ? 'linear-gradient(135deg, #dc3545, #c82333)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: pinnedFilter === filter 
                        ? '1px solid rgba(220, 53, 69, 0.3)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: pinnedFilter === filter ? 'white' : 'rgba(255, 255, 255, 0.6)',
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      textTransform: 'capitalize',
                      minWidth: '45px'
                    }}
                  >
                    {filter === "all" ? "All" : filter === "artists" ? "Art" : "Alb"}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Scrolling List */}
            <div 
              className="d-flex gap-3 pb-3"
              style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                msOverflowStyle: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Custom Scrollbar Styles */}
              <style>
                {`
                  .pinned-scroll::-webkit-scrollbar {
                    height: 6px;
                  }
                  .pinned-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                  }
                  .pinned-scroll::-webkit-scrollbar-thumb {
                    background: rgba(220, 53, 69, 0.5);
                    border-radius: 3px;
                  }
                  .pinned-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(220, 53, 69, 0.7);
                  }
                `}
              </style>

              {/* Render Artists if filter allows */}
              {(pinnedFilter === "all" || pinnedFilter === "artists") && 
                pinnedItems.artists.map((artist, index) => (
                  <div
                    key={`pinned-artist-${artist.id}`}
                    className="flex-shrink-0"
                    style={{
                      width: '280px',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, rgba(255, 133, 27, 0.1), rgba(255, 107, 53, 0.05))',
                      border: '1px solid rgba(255, 133, 27, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(255, 133, 27, 0.2)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 133, 27, 0.3)';
                      e.currentTarget.style.border = '1px solid rgba(255, 133, 27, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 133, 27, 0.2)';
                      e.currentTarget.style.border = '1px solid rgba(255, 133, 27, 0.2)';
                    }}
                    onClick={() => handleItemClick(artist, 'artists')}
                  >
                    {/* Pin Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(artist, 'artists');
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'linear-gradient(135deg, #dc3545, #c82333)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.7rem',
                        transition: 'all 0.3s ease',
                        zIndex: 2
                      }}
                    >
                      <FaThumbtack style={{ transform: 'rotate(45deg)' }} />
                    </button>

                    <div className="d-flex align-items-center p-3">
                      {/* Artist Image */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '2px solid rgba(255, 133, 27, 0.3)',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={artist.image?.[1]?.url || artist.image?.[0]?.url}
                          alt={artist.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Artist Info */}
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center mb-1">
                          <div
                            style={{
                              background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.6rem',
                              fontWeight: '600',
                              color: 'white',
                              marginRight: '8px'
                            }}
                          >
                            <FaUser className="me-1" style={{ fontSize: '0.5rem' }} />
                            ARTIST
                          </div>
                        </div>
                        <h6 
                          style={{ 
                            color: '#fff', 
                            fontWeight: '600', 
                            fontSize: '0.9rem', 
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {truncateText(artist.name, 20)}
                        </h6>
                        <p 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            fontSize: '0.75rem', 
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {truncateText('Explore discography', 25)}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(255, 133, 27, 0.3)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaPlayCircle style={{ color: '#ff851b', fontSize: '14px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {/* Render Albums if filter allows */}
              {(pinnedFilter === "all" || pinnedFilter === "albums") && 
                pinnedItems.albums.map((album, index) => (
                  <div
                    key={`pinned-album-${album.id}`}
                    className="flex-shrink-0"
                    style={{
                      width: '280px',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.05))',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(40, 167, 69, 0.2)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(40, 167, 69, 0.3)';
                      e.currentTarget.style.border = '1px solid rgba(40, 167, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(40, 167, 69, 0.2)';
                      e.currentTarget.style.border = '1px solid rgba(40, 167, 69, 0.2)';
                    }}
                    onClick={() => handleItemClick(album, 'albums')}
                  >
                    {/* Pin Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(album, 'albums');
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'linear-gradient(135deg, #dc3545, #c82333)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.7rem',
                        transition: 'all 0.3s ease',
                        zIndex: 2
                      }}
                    >
                      <FaThumbtack style={{ transform: 'rotate(45deg)' }} />
                    </button>

                    <div className="d-flex align-items-center p-3">
                      {/* Album Image */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid rgba(40, 167, 69, 0.3)',
                          marginRight: '12px',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={album.image?.[1]?.url || album.image?.[0]?.url}
                          alt={album.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Album Info */}
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center mb-1">
                          <div
                            style={{
                              background: 'linear-gradient(135deg, #28a745, #20c997)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.6rem',
                              fontWeight: '600',
                              color: 'white',
                              marginRight: '8px'
                            }}
                          >
                            <FaCompactDisc className="me-1" style={{ fontSize: '0.5rem' }} />
                            ALBUM
                          </div>
                          {album.year && (
                            <span
                              style={{
                                background: 'rgba(40, 167, 69, 0.2)',
                                color: 'rgba(40, 167, 69, 0.8)',
                                borderRadius: '3px',
                                padding: '1px 4px',
                                fontSize: '0.6rem',
                                fontWeight: '500'
                              }}
                            >
                              {album.year}
                            </span>
                          )}
                        </div>
                        <h6 
                          style={{ 
                            color: '#fff', 
                            fontWeight: '600', 
                            fontSize: '0.9rem', 
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {truncateText(album.name, 20)}
                        </h6>
                        <p 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            fontSize: '0.75rem', 
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {truncateText(album.artists?.primary?.map(artist => artist.name).join(", ") || "Various Artists", 25)}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(40, 167, 69, 0.3)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaPlay style={{ color: '#28a745', fontSize: '12px', marginLeft: '1px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            {/* Bold Heading with Icon */}
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(255, 133, 27, 0.4)',
                }}
              >
                <FaSearch style={{ color: 'white', fontSize: '24px' }} />
              </div>
              <div>
                <h1 
                  className="mb-0"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #fff, #e1e8ed)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Discover Playlists
                </h1>
                <p 
                  className="mb-0 mt-1"
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem'
                  }}
                >
                  Search for artists and albums in one place
                </p>
              </div>
            </div>

            {/* Results Summary */}
            {hasSearched && !loading && (
              <div 
                className="d-flex align-items-center gap-4"
              >
                <div 
                  className="text-center p-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    minWidth: '80px'
                  }}
                >
                  <div 
                    style={{
                      color: '#fff',
                      fontSize: '1.4rem',
                      fontWeight: '600'
                    }}
                  >
                    {totalResults}
                  </div>
                  <div 
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem'
                    }}
                  >
                    Total Results
                  </div>
                </div>
                
                {artistResults.length > 0 && (
                  <div 
                    className="text-center p-3"
                    style={{
                      background: 'rgba(255, 133, 27, 0.1)',
                      border: '1px solid rgba(255, 133, 27, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      minWidth: '80px'
                    }}
                  >
                    <div 
                      style={{
                        color: '#ff851b',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}
                    >
                      {artistResults.length}
                    </div>
                    <div 
                      style={{
                        color: 'rgba(255, 133, 27, 0.8)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <FaUser className="me-1" />
                      Artists
                    </div>
                  </div>
                )}
                
                {albumResults.length > 0 && (
                  <div 
                    className="text-center p-3"
                    style={{
                      background: 'rgba(40, 167, 69, 0.1)',
                      border: '1px solid rgba(40, 167, 69, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      minWidth: '80px'
                    }}
                  >
                    <div 
                      style={{
                        color: '#28a745',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}
                    >
                      {albumResults.length}
                    </div>
                    <div 
                      style={{
                        color: 'rgba(40, 167, 69, 0.8)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <FaCompactDisc className="me-1" />
                      Albums
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Bar and Filters - Responsive Layout */}
          <div className="row mb-4">
            <div className="col-12">
              <form onSubmit={handleSearch}>
                {/* Search bar - full width on mobile */}
                <div className="mb-3">
                  <div className="position-relative">
                    <FaSearch 
                      className="position-absolute top-50 translate-middle-y ms-3"
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '1rem',
                        zIndex: 2
                      }}
                    />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Search for artists and albums..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        padding: '12px 20px 12px 45px',
                        backdropFilter: 'blur(20px)',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid rgba(255, 133, 27, 0.3)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 133, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Filter and Search buttons */}
                <div className="d-flex gap-3">
                  <button 
                    type="button"
                    className="btn d-flex align-items-center flex-grow-1 flex-sm-grow-0"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                      background: showFilters 
                        ? 'linear-gradient(135deg, #ff851b, #ff6b35)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: showFilters
                        ? '1px solid rgba(255, 133, 27, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: showFilters ? 'white' : 'rgba(255, 255, 255, 0.8)',
                      padding: '12px 20px',
                      fontWeight: '500',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: showFilters 
                        ? '0 4px 16px rgba(255, 133, 27, 0.4)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.2)',
                      justifyContent: 'center'
                    }}
                  >
                    <FaFilter className="me-2" />
                    Filter
                  </button>
                  
                  <button 
                    type="submit"
                    className="btn flex-grow-1 flex-sm-grow-0"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontWeight: '600',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 16px rgba(255, 133, 27, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      opacity: loading ? 0.7 : 1,
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(135deg, #ff6b35, #ff851b)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 24px rgba(255, 133, 27, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(135deg, #ff851b, #ff6b35)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(255, 133, 27, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {/* Filter Options */}
              {showFilters && (
                <div 
                  className="d-flex gap-2 mt-3 flex-wrap"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <span 
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      alignSelf: 'center',
                      marginRight: '8px'
                    }}
                  >
                    Show:
                  </span>
                  
                  {["all", "artists", "albums"].map((filter) => (
                    <button
                      key={filter}
                      className={`btn btn-sm ${filterType === filter ? 'active' : ''}`}
                      onClick={() => setFilterType(filter)}
                      style={{
                        background: filterType === filter 
                          ? 'linear-gradient(135deg, #ff851b, #ff6b35)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: filterType === filter 
                          ? '1px solid rgba(255, 133, 27, 0.3)' 
                          : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: filterType === filter ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        padding: '6px 16px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        textTransform: 'capitalize'
                      }}
                    >
                      {filter === "all" ? "All Results" : filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section as Compact Lists */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div 
              className="text-center py-5"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="spinner-border text-warning mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h3 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Discovering music...
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Searching for artists and albums
              </p>
            </div>
          ) : !hasSearched ? (
            <div 
              className="text-center py-5"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <FaSearch 
                style={{
                  fontSize: '4rem',
                  color: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: '2rem'
                }}
              />
              <h3 
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1rem'
                }}
              >
                Start Your Musical Journey
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.1rem' }}>
                Search for your favorite artists and discover new albums
              </p>
              <div className="d-flex justify-content-center gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <FaUser className="me-2" style={{ color: '#ff851b' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Artists</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaCompactDisc className="me-2" style={{ color: '#28a745' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Albums</span>
                </div>
              </div>
            </div>
          ) : (artistResults.length === 0 && albumResults.length === 0) ? (
            <div 
              className="text-center py-5"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <FaSearch 
                style={{
                  fontSize: '3rem',
                  color: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: '1rem'
                }}
              />
              <h3 
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '0.5rem'
                }}
              >
                No results found
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Try different search terms or check the spelling
              </p>
            </div>
          ) : (
            <div className="row">
              {/* Artists Column */}
              {(filterType === "all" || filterType === "artists") && artistResults.length > 0 && (
                <div className={`col-12 ${filterType === "all" ? "col-lg-6" : ""} mb-4`}>
                  {filterType === "all" && (
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
                          borderRadius: '10px',
                          boxShadow: '0 4px 16px rgba(255, 133, 27, 0.3)',
                        }}
                      >
                        <FaUser style={{ color: 'white', fontSize: '14px' }} />
                      </div>
                      <h3 
                        style={{
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '1.5rem',
                          marginBottom: '0'
                        }}
                      >
                        Artists
                      </h3>
                      <span 
                        className="ms-3 px-2 py-1"
                        style={{
                          background: 'rgba(255, 133, 27, 0.2)',
                          border: '1px solid rgba(255, 133, 27, 0.3)',
                          borderRadius: '16px',
                          color: '#ff851b',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {artistResults.length}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    {artistResults.map((artist, index) => 
                      renderCompactArtistRow(artist, index)
                    )}
                  </div>
                </div>
              )}

              {/* Albums Column */}
              {(filterType === "all" || filterType === "albums") && albumResults.length > 0 && (
                <div className={`col-12 ${filterType === "all" ? "col-lg-6" : ""}`}>
                  {filterType === "all" && (
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #28a745, #20c997)',
                          borderRadius: '10px',
                          boxShadow: '0 4px 16px rgba(40, 167, 69, 0.3)',
                        }}
                      >
                        <FaCompactDisc style={{ color: 'white', fontSize: '14px' }} />
                      </div>
                      <h3 
                        style={{
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '1.5rem',
                          marginBottom: '0'
                        }}
                      >
                        Albums
                      </h3>
                      <span 
                        className="ms-3 px-2 py-1"
                        style={{
                          background: 'rgba(40, 167, 69, 0.2)',
                          border: '1px solid rgba(40, 167, 69, 0.3)',
                          borderRadius: '16px',
                          color: '#28a745',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {albumResults.length}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    {albumResults.map((album, index) => 
                      renderCompactAlbumRow(album, index)
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicSearchPage;