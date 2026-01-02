import React, { useState, useEffect } from 'react';
import { FaSearch, FaGlobe, FaFire, FaVolumeUp, FaMapMarkerAlt, FaLanguage, FaTag } from 'react-icons/fa';
import { useAppContext } from '../context/PlayerContext';
import '../pages/RadioPage.css';

const RadioPage = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryInput, setCountryInput] = useState(null);
  const [languageInput, setLanguageInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [filterType, setFilterType] = useState('popular');
  const [detectionAttempted, setDetectionAttempted] = useState(false);
  const [geoLocationFailed, setGeoLocationFailed] = useState(false);
  const { handlePlay } = useAppContext();

  // Geolocation and country detection
  useEffect(() => {
    const detectCountry = async () => {
      setLoading(true);
      setDetectionAttempted(false);
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryName = data.country_name;

        if (countryName) {
          setCountryInput(countryName);
          localStorage.setItem('radioCountry', countryName);
          setDetectionAttempted(true);
          setGeoLocationFailed(false);
          // Load initial stations for detected country
          await fetchStationsByCountry(countryName);
        } else {
          throw new Error('Country not detected');
        }
      } catch (err) {
        console.error('Geolocation failed:', err);
        setGeoLocationFailed(true);
        setDetectionAttempted(true);
        const savedCountry = localStorage.getItem('radioCountry');
        setCountryInput(savedCountry || null);
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  // Calculate popular score
  const calculateScore = (stationsList) => {
    if (stationsList.length === 0) return stationsList;

    const maxVotes = Math.max(...stationsList.map(s => s.votes || 0), 1);
    const maxClicks = Math.max(...stationsList.map(s => s.clickcount || 0), 1);

    return stationsList.map(station => {
      const normalizedVotes = (station.votes || 0) / maxVotes;
      const normalizedClicks = (station.clickcount || 0) / maxClicks;

      let popularScore = normalizedVotes * 0.6 + normalizedClicks * 0.4;

      if ((station.clicktrend || 0) > 0) {
        popularScore += 0.05;
      }

      return {
        ...station,
        popularScore,
      };
    });
  };

  // Filter stations by quality
  const filterStations = (stationList) => {
    return stationList.filter(
      station =>
        station.lastcheckok === 1 &&
        station.bitrate >= 64 &&
        (station.votes || 0) >= 5 &&
        station.url_resolved
    );
  };

  // Endpoint 1: Get stations by country
  const fetchStationsByCountry = async (country) => {
    setLoading(true);
    setError(null);

    if (!country || !country.trim()) {
      setError('Please enter a country name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}?order=votes&reverse=true&limit=200`
      );

      if (!response.ok) throw new Error('Failed to fetch stations');

      let data = await response.json();

      if (data.length === 0) {
        setError(`No stations found for country: ${country}`);
        setStations([]);
        setFilteredStations([]);
        setLoading(false);
        return;
      }

      // Apply quality filter
      data = filterStations(data);

      if (data.length === 0) {
        setError('No high-quality stations found. Try a different country.');
        setStations([]);
        setFilteredStations([]);
        setLoading(false);
        return;
      }

      // Calculate scores
      data = calculateScore(data);
      data.sort((a, b) => b.popularScore - a.popularScore);

      setStations(data);
      applyFilters(data, filterType, searchTerm);
    } catch (err) {
      console.error('Error fetching by country:', err);
      setError('Failed to load stations. Please try another country.');
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 2: Top voted stations (global fallback)
  const fetchTopVotedStations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://de1.api.radio-browser.info/json/stations/topvote/100'
      );

      const data = await response.json();
      const filtered = filterStations(data);

      if (filtered.length === 0) {
        setError('No stations available right now.');
        setLoading(false);
        return;
      }

      const scored = calculateScore(filtered);
      scored.sort((a, b) => b.popularScore - a.popularScore);

      setStations(scored);
      applyFilters(scored, filterType, searchTerm);
    } catch (err) {
      console.error('Error fetching top voted:', err);
      setError('Failed to load popular stations.');
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 3: Top clicked stations (trending)
  const fetchTrendingStations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://de1.api.radio-browser.info/json/stations/topclick/100'
      );

      const data = await response.json();
      const filtered = filterStations(data);

      if (filtered.length === 0) {
        setError('No trending stations available.');
        setLoading(false);
        return;
      }

      const scored = calculateScore(filtered);
      scored.sort((a, b) => (b.clicktrend || 0) - (a.clicktrend || 0));

      setStations(scored);
      applyFilters(scored, 'trending', searchTerm);
    } catch (err) {
      console.error('Error fetching trending:', err);
      setError('Failed to load trending stations.');
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 4: Search stations by name
  const searchStations = async (query) => {
    if (!query.trim()) {
      if (countryInput) {
        fetchStationsByCountry(countryInput);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&order=votes&reverse=true&limit=50`
      );

      const data = await response.json();
      const filtered = filterStations(data);

      if (filtered.length === 0) {
        setError(`No stations found for: "${query}"`);
        setStations([]);
        setFilteredStations([]);
        setLoading(false);
        return;
      }

      const scored = calculateScore(filtered);
      scored.sort((a, b) => b.popularScore - a.popularScore);
      setStations(scored);
      applyFilters(scored, filterType, query);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 5: Filter by genre/tag
  const fetchStationsByGenre = async (genre) => {
    setLoading(true);
    setError(null);

    if (!genre || !genre.trim()) {
      setError('Please enter a genre name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/bytag/${encodeURIComponent(genre)}?order=votes&reverse=true&limit=100`
      );

      const data = await response.json();
      const filtered = filterStations(data);

      if (filtered.length === 0) {
        setError(`No stations found for genre: ${genre}`);
        setStations([]);
        setFilteredStations([]);
        setLoading(false);
        return;
      }

      const scored = calculateScore(filtered);
      scored.sort((a, b) => b.popularScore - a.popularScore);

      setStations(scored);
      applyFilters(scored, filterType, searchTerm);
    } catch (err) {
      console.error('Error fetching by genre:', err);
      setError('Failed to load stations. Try a different genre.');
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 6: Filter by language
  const fetchStationsByLanguage = async (language) => {
    setLoading(true);
    setError(null);

    if (!language || !language.trim()) {
      setError('Please enter a language name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/bylanguage/${encodeURIComponent(language)}?order=votes&reverse=true&limit=100`
      );

      const data = await response.json();
      const filtered = filterStations(data);

      if (filtered.length === 0) {
        setError(`No stations found for language: ${language}`);
        setStations([]);
        setFilteredStations([]);
        setLoading(false);
        return;
      }

      const scored = calculateScore(filtered);
      scored.sort((a, b) => b.popularScore - a.popularScore);

      setStations(scored);
      applyFilters(scored, filterType, searchTerm);
    } catch (err) {
      console.error('Error fetching by language:', err);
      setError('Failed to load stations. Try a different language.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filter logic
  const applyFilters = (stationList, filter, search) => {
    let result = [...stationList];

    if (search.trim()) {
      result = result.filter(station =>
        station.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (filter) {
      case 'trending':
        result.sort((a, b) => (b.clicktrend || 0) - (a.clicktrend || 0));
        break;
      case 'highquality':
        result = result.filter(s => s.bitrate >= 128);
        result.sort((a, b) => b.bitrate - a.bitrate);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.popularScore - a.popularScore);
    }

    setFilteredStations(result.slice(0, 30));
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
    if (newFilter === 'trending') {
      fetchTrendingStations();
    } else {
      applyFilters(stations, newFilter, searchTerm);
    }
  };

  // Handle country change
  const handleCountryChange = (country) => {
    setCountryInput(country);
    if (country && country.trim()) {
      localStorage.setItem('radioCountry', country);
      fetchStationsByCountry(country);
    }
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    setLanguageInput(language);
    if (language && language.trim()) {
      fetchStationsByLanguage(language);
    }
  };

  // Handle genre change
  const handleGenreChange = (genre) => {
    setGenreInput(genre);
    if (genre && genre.trim()) {
      fetchStationsByGenre(genre);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchTerm(query);
    if (query && query.trim()) {
      searchStations(query);
    } else if (countryInput) {
      fetchStationsByCountry(countryInput);
    }
  };

  // Play radio station
  const playStation = (station) => {
    const stationTrack = {
      id: station.stationuuid || `radio-${station.name}`,
      name: station.name,
      primaryArtists: station.country || 'Radio Station',
      image: [
        {
          url: station.favicon || 'https://via.placeholder.com/150?text=Radio',
        },
      ],
      downloadUrl: [
        {
          quality: 'radio',
          link: station.url_resolved,
        },
      ],
      duration: 0,
      isRadio: true,
      station: station,
    };

    handlePlay(stationTrack, 'radio');
  };

  return (
    <div className="radio-page">
      <div className="radio-container">
        {/* Header */}
        <div className="radio-header">
          <div className="radio-title-section">
            <FaGlobe className="radio-icon" />
            <h1>Radio Stations</h1>
            <p>Discover thousands of live radio stations from around the world</p>
          </div>
        </div>

        {/* Detection Status */}
        {detectionAttempted && (
          <div className={`detection-banner ${geoLocationFailed ? 'failed' : 'success'}`}>
            <div className="detection-message">
              {geoLocationFailed ? (
                <span>📍 Location detection failed. Please enter your country, language, or genre below.</span>
              ) : (
                <span>✅ Location detected: <strong>{countryInput}</strong></span>
              )}
            </div>
          </div>
        )}

        {/* Loading Detection State */}
        {loading && !detectionAttempted && (
          <div className="loading-detection">
            <div className="spinner" />
            <p>Detecting your location and loading stations...</p>
          </div>
        )}

        {/* Filters Section */}
        {detectionAttempted && (
          <>
            {/* Text Input Filters */}
            <div className="radio-controls-advanced">
              <div className="control-group">
                <label className="control-label">
                  <FaMapMarkerAlt size={14} /> Country
                </label>
                <input
                  type="text"
                  placeholder="e.g., India, USA, UK"
                  value={countryInput || ''}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value.trim()) {
                      fetchStationsByCountry(e.target.value);
                    }
                  }}
                  className="control-input"
                />
              </div>

              <div className="control-group">
                <label className="control-label">
                  <FaLanguage size={14} /> Language
                </label>
                <input
                  type="text"
                  placeholder="e.g., English, Hindi, Spanish"
                  value={languageInput}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value.trim()) {
                      fetchStationsByLanguage(e.target.value);
                    }
                  }}
                  className="control-input"
                />
              </div>

              <div className="control-group">
                <label className="control-label">
                  <FaTag size={14} /> Genre
                </label>
                <input
                  type="text"
                  placeholder="e.g., rock, pop, jazz"
                  value={genreInput}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value.trim()) {
                      fetchStationsByGenre(e.target.value);
                    }
                  }}
                  className="control-input"
                />
              </div>

              {/* Search */}
              <div className="control-group search-group">
                <label className="control-label">
                  <FaSearch size={14} /> Station Name
                </label>
                <input
                  type="text"
                  placeholder="Search stations by name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="control-input"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="radio-filters">
              <button
                className={`filter-btn ${filterType === 'popular' ? 'active' : ''}`}
                onClick={() => handleFilterChange('popular')}
              >
                <FaGlobe size={16} /> Popular
              </button>
              <button
                className={`filter-btn ${filterType === 'trending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('trending')}
              >
                <FaFire size={16} /> Trending
              </button>
              <button
                className={`filter-btn ${filterType === 'highquality' ? 'active' : ''}`}
                onClick={() => handleFilterChange('highquality')}
              >
                <FaVolumeUp size={16} /> High Quality
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-banner">
                <p>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading radio stations...</p>
              </div>
            )}

            {/* Stations Grid */}
            {!loading && !error && (
              <div className="stations-grid">
                {filteredStations.length > 0 ? (
                  filteredStations.map((station) => (
                    <div
                      key={station.stationuuid || station.name}
                      className="station-card"
                      onClick={() => playStation(station)}
                    >
                      <div className="station-image">
                        <img
                          src={station.favicon || 'https://via.placeholder.com/150?text=Radio'}
                          alt={station.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Radio';
                          }}
                        />
                        <div className="play-overlay">
                          <FaGlobe size={32} />
                        </div>
                      </div>
                      <div className="station-info">
                        <h3>{station.name}</h3>
                        <p className="station-meta">
                          {station.country} • {station.bitrate}kbps
                        </p>
                        <div className="station-stats">
                          <span className="stat">
                            👥 {(station.votes || 0).toLocaleString()}
                          </span>
                          <span className="stat">
                            ▶️ {(station.clickcount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <FaGlobe size={48} />
                    <p>No stations found. Try a different search or filter.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RadioPage;
