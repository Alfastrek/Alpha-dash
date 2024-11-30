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
    onColorSelect(selectedColor);
    setShowColorDropdown(false);
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
          setShowColorDropdown(!showColorDropdown);
        }}
      >
        ●
      </span>

      {/* Color dropdown as an overlay to the right */}
      {showColorDropdown && (
        <div className="color-dropdown-overlay">
          {["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF6347"].map(
            (color) => (
              <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              ></div>
            )
          )}
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
