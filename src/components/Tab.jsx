import React from "react";

const Tab = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`tab ${isActive ? "active" : ""}`} // Apply "active" class when isActive is true
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Tab;
