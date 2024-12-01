import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import loadCSV from "../services/csvService";
import TableComponent from "../components/TableComponent";
import "../styles/CustomThemeDemo.scss";
import Loader from "../components/Loader";

const FileView = () => {
  const { folder, file } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadCSV(`/csv/${folder}/${file}`);
        setFileData(data);
      } catch (error) {
        console.error(`Error loading ${folder}/${file}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [folder, file]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="file-view">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate("/dashboard")}
          className="original-button-return"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate("/upload")}
          className="original-button-return-upload"
        >
          Upload File
        </button>
      </div>
      <h2 className="file-title">{`${folder}/${file}`}</h2>

      <TableComponent fileData={fileData} />
    </div>
  );
};

export default FileView;
