import PropTypes from "prop-types";

const Tab = ({ label, isActive, onClick, isFolderTab }) => {
  return (
    <button
      className={`tab-btn ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <span className="icon">
        <i className={`fa ${isFolderTab ? "fa-folder" : "fa-file"}`} />
      </span>
      <span className="label">{label}</span>
    </button>
  );
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isFolderTab: PropTypes.bool.isRequired,
};

export default Tab;
