/* eslint-disable react/prop-types */
import Toggle from "react-toggle";
import "react-toggle/style.css";

const ToggleButton = ({ checked, onChange }) => {
  return (
    <div className="toggle-container">
      <Toggle checked={checked} onChange={onChange} icons={false} />
    </div>
  );
};

export default ToggleButton;
