import { useNavigate } from "react-router-dom";
import "../styles/welcome.css"; // Ensure this file is properly linked
import MatrixBG from "../components/MatrixBG";
const Welcome = () => {
  const navigate = useNavigate();

  const handleTryOutClick = () => {
    navigate("/dashboard"); // Navigate to the main route
  };

  const handleUploadClick = () => {
    navigate("/upload"); // Navigate to the upload page
  };

  return (
    <>
      <MatrixBG />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="content">
          <div className="revealText">
            <h1 className="animatedGradientText">Alpha - Dash</h1>
          </div>
          <div className="additionalInfo">
            <h2 className="subHeading">Your Data, Organized and Analyzed.</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btnn" onClick={handleTryOutClick}>
                Sample CSV's
              </button>
              <button className="btnn" onClick={handleUploadClick}>
                Upload Yours
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "transparent", // Dark background for footer
            color: "white",
            textAlign: "center",
            padding: "10px 0",
            zIndex: 2,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",

              color: "#ffffff",
            }}
          >
            Assignment Created for AlphaGrep by Aradhya Shukla.
            <a
              href="https://github.com/Alfastrek/Alpha-dash"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffffff",
                textDecoration: "underline",
                marginLeft: "5px",
              }}
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Welcome;
