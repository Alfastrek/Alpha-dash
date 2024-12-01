import PropTypes from "prop-types";
import { useState } from "react";

const Tab = ({
  label,
  isActive,
  onClick,
  isFolderTab,
  color,
  onColorSelect,
}) => {
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const handleColorSelect = (selectedColor) => {
    onColorSelect(selectedColor); // Pass the selected color to parent component
    setShowColorDropdown(false); // Close the color dropdown after selection
  };

  return (
    <button
      className={`tab-btn ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-expanded={isActive}
      style={{
        outline: `3px solid ${color || "transparent"}`,
        fontFamily: "Parkinsans, serif",
        fontSize: "1.2rem",
        fontWeight: 400,
        width: "220px",
        position: "relative", // Set relative position to anchor the dropdown
      }}
    >
      <span className="icon">
        <i className={`fa ${isFolderTab ? "fa-folder" : "fa-file"}`} />
      </span>
      <span className="label">{label}</span>

      {/* Color selection dot */}
      <span
        className="color-selector"
        onClick={(e) => {
          e.stopPropagation();
          setShowColorDropdown(!showColorDropdown); // Toggle dropdown visibility
        }}
        style={{
          fontSize: "1.5rem",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        ●
      </span>

      {/* Color dropdown as an overlay below the button */}
      {showColorDropdown && (
        <div className="color-dropdown-overlay">
          {[
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF6347",
            "transparent",
          ].map((color) => (
            <div
              key={color}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)} // Set the color on click
            ></div>
          ))}
        </div>
      )}
    </button>
  );
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isFolderTab: PropTypes.bool.isRequired,
  color: PropTypes.string,
  onColorSelect: PropTypes.func.isRequired,
};

Tab.defaultProps = {
  color: "transparent",
};

export default Tab;
