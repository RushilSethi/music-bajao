import { Link } from "react-router-dom";
import { useAppContext } from "../context/PlayerContext";

const Navbar = ({ setTriggerFetch }) => {
  const { keyword, setKeyword, handleBitrateChange, getTracks, selectedBitrate } =
    useAppContext();

  const handleLogoClick = () => {
    setKeyword("");
    setTriggerFetch(true);
  };

  // Map bitrate values to their display names
  const bitrateOptions = [
    { value: 0, label: "12kbps (Data Saver)" },
    { value: 1, label: "48kbps" },
    { value: 2, label: "96kbps" },
    { value: 3, label: "160kbps (Default)" },
    { value: 4, label: "320kbps (HD)" }
  ];

  const renderDropdownItem = (option, isDefault = false) => {
    const isActive = selectedBitrate === option.value;
    
    return (
      <li key={option.value}>
        <button
          className={`dropdown-item d-flex align-items-center justify-content-between ${isActive ? 'active-quality' : 'inactive-quality'}`}
          onClick={() => handleBitrateChange(option.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <span>{option.label}</span>
          {isActive && (
            <span className="quality-checkmark">
              ✓
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      data-bs-theme="dark"
      style={{ 
        background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95), rgba(30, 30, 30, 0.95))',
        backdropFilter: 'blur(20px)',
        borderBottom: "1px solid rgba(255, 133, 27, 0.2)",
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1050
      }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <Link 
          className="navbar-brand d-flex align-items-center" 
          to="/" 
          onClick={handleLogoClick}
          style={{
            transition: 'all 0.3s ease',
            padding: '8px 12px',
            borderRadius: '12px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 133, 27, 0.1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img
            src="/bajao_icon.png"
            alt="Bajao Icon"
            width="40"
            height="40"
            className="me-2"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(255, 133, 27, 0.3))'
            }}
          />
          <span 
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffcc5c, #ff851b, #ff6b35, #ffaa3e, #ffcc5c)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease-in-out infinite',
              textShadow: '0 0 20px rgba(255, 204, 92, 0.4)',
              filter: 'drop-shadow(0 2px 4px rgba(255, 133, 27, 0.3)) drop-shadow(0 0 8px rgba(255, 204, 92, 0.2))'
            }}
          >
            Bajao
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          style={{
            border: '1px solid rgba(255, 133, 27, 0.3)',
            borderRadius: '8px'
          }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className="nav-link"
                to="/"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff851b';
                  e.target.style.background = 'rgba(255, 133, 27, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link"
                to="/playlist"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff851b';
                  e.target.style.background = 'rgba(255, 133, 27, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Your Playlist
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link 
                className="nav-link"
                to="/radio"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff4757';
                  e.target.style.background = 'rgba(255, 71, 87, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🎙️ Radio
              </Link>
            </li> */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff851b';
                  e.target.style.background = 'rgba(255, 133, 27, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Streaming Quality
              </a>
              <ul 
                className="dropdown-menu"
                style={{
                  background: 'rgba(23, 23, 23, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 133, 27, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  padding: '8px',
                  zIndex: 1060
                }}
              >
                {renderDropdownItem(bitrateOptions[0])}
                {renderDropdownItem(bitrateOptions[1])}
                {renderDropdownItem(bitrateOptions[2])}
                {renderDropdownItem(bitrateOptions[4])}
                <li>
                  <hr 
                    className="dropdown-divider" 
                    style={{ 
                      borderColor: 'rgba(255, 133, 27, 0.2)',
                      margin: '8px 0'
                    }}
                  />
                </li>
                {renderDropdownItem(bitrateOptions[3])}
              </ul>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link disabled"
                style={{
                  color: 'rgba(255, 255, 255, 0.4) !important'
                }}
              >
                Download Music
              </a>
            </li>
          </ul>

          <form
            className="d-flex navbar-search-input"
            role="search"
            onSubmit={getTracks}
          >
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control me-2"
              type="search"
              placeholder="Search for songs by name, artists or language"
              aria-label="Search"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 133, 27, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                padding: '10px 16px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                minWidth: '280px'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(255, 133, 27, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 133, 27, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255, 133, 27, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
            <button 
              className="btn"
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ff851b, #ff6b35)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '10px 20px',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(255, 133, 27, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff6b35, #ff851b)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(255, 133, 27, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff851b, #ff6b35)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(255, 133, 27, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .navbar-nav .nav-link:hover {
          color: #ff851b !important;
        }
        
        .navbar-nav .nav-link.active {
          color: #ff851b !important;
        }
        
        .dropdown-menu {
          animation: fadeInScale 0.2s ease-out;
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        /* Custom scrollbar for dropdown if needed */
        .dropdown-menu::-webkit-scrollbar {
          width: 8px;
        }
        
        .dropdown-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }
        
        .dropdown-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 71, 87, 0.5);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.02);
        }
        
        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 71, 87, 0.7);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;