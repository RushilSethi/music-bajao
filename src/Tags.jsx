import React from "react";
import "./Tags.css"; // Optional CSS for custom styling

function Tags({ onTagClick }) {
  const tags = [
    "Hindi Songs",
    "English Songs",
    "Punjabi Hits",
    "Old Songs",
    "Workout Mix",
    "Arijit Singh",
    "KK",
    "Neha Kakkar",
    "Badshah",
    "New Releases",
    "Top 40",
    "Trending Now",
  ];

  return (
    <div className="tags-container">
      {/* For small screens, display an accordion */}
      <div className="accordion d-lg-none" id="tagsAccordion">
        {tags.map((tag, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="true"
                aria-controls={`collapse${index}`}
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#tagsAccordion"
            >
              <div className="accordion-body">
                {/* Include any additional description or functionality if needed */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* For large screens, display the tags inline */}
      <div className="d-none d-lg-flex flex-wrap gap-2 my-4">
        {tags.map((tag, index) => (
          <button
            key={index}
            className="btn btn-outline-primary tag-btn"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tags;
