import { useState } from "react";
import TableComponent from "../components/TableComponent";
import Loader from "../components/Loader";
import loadCSV from "../services/csvService";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file) {
      setFileName(file.name);
    }

    setIsLoading(true);

    loadCSV(file)
      .then((result) => {
        setCsvData(result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error parsing CSV file:", error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="upload-page">
      <h2 className="upload-title">Upload Your CSV File</h2>
      <button onClick={() => navigate("/")} className="original-button-return">
        Back to Home
      </button>
      <div
        className="upload-container"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="upload-input"
          style={{ width: "110px" }}
        />
        {fileName && <span style={{ marginLeft: "10px" }}>{fileName}</span>}
      </div>

      <TableComponent fileData={csvData} />
    </div>
  );
};

export default Upload;
