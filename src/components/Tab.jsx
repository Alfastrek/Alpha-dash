import React from "react";
import PropTypes from "prop-types";

const Tab = ({ label, isActive, onClick, isFolderTab }) => {
  return (
    <button
      className={`btn btn-outline-primary d-flex align-items-center ${
        isActive ? "active" : ""
      } ${isFolderTab ? "folder-tab" : "file-tab"} mb-2`}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <i className={`fa ${isFolderTab ? "fa-folder" : "fa-file"} mr-2`} />
      {label}
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
