/* eslint-disable react/prop-types */
import { FlagSpinner } from "react-spinners-kit";

const Loader = ({ size = 50, color = "#3498db" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <FlagSpinner size={size} color={color} loading={true} />
    </div>
  );
};

export default Loader;
