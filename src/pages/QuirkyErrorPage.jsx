import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGhost, FaArrowLeft } from "react-icons/fa";

const QuirkyErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#1a1a1a",
      color: "#f1f1f1",
      textAlign: "center",
      padding: "2rem"
    }}>
      <FaGhost style={{ fontSize: "6rem", marginBottom: "1.5rem", color: "#ff6b35", filter: "drop-shadow(0 4px 16px #0008)" }} />
      <h1 style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "1rem", color: "#fff", textShadow: "0 2px 10px #0006" }}>
        404: Oops! Lost in Music Space
      </h1>
      <p style={{ fontSize: "1.3rem", marginBottom: "2rem", maxWidth: 500, color: "#f1f1f1", opacity: 0.85 }}>
        This page is as empty as a silent disco. <br />
        Maybe you hit a wrong note, or the song just hasn't been written yet!
      </p>
      <button
        className="btn"
        style={{
          background: "#2c2c2c",
          color: "#ff6b35",
          border: "none",
          borderRadius: "8px",
          padding: "0.75rem 2rem",
          fontWeight: 700,
          fontSize: "1.1rem",
          boxShadow: "0 2px 8px #0002",
          transition: "all 0.2s",
          cursor: "pointer"
        }}
        onClick={() => navigate(-1)}
        onMouseEnter={e => e.currentTarget.style.background = "#232323"}
        onMouseLeave={e => e.currentTarget.style.background = "#2c2c2c"}
      >
        <FaArrowLeft className="me-2" /> Go Back
      </button>
      <div style={{ marginTop: "2.5rem", fontSize: "1.1rem", opacity: 0.7, color: "#ff6b35" }}>
        <span role="img" aria-label="music">🎵</span> Keep grooving!
      </div>
    </div>
  );
};

export default QuirkyErrorPage;
