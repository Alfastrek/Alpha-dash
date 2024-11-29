import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import loadCSV from "../services/csvService";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
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

  const addSerialNumber = (data) =>
    data.map((row, index) => ({ ...row, serialNumber: index + 1 }));

  const getColumnDefs = (data) => {
    if (Array.isArray(data) && data.length > 0 && data[0]) {
      return [
        { headerName: "S.No", field: "serialNumber", width: 90 },
        ...Object.keys(data[0]).map((key) => ({ headerName: key, field: key })),
      ];
    }
    return [];
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="file-view">
      <button onClick={() => navigate("/")} className="btn btn-primary mb-3">
        Back to Home
      </button>
      <h2 className="file-title">{`${folder}/${file}`}</h2>
      {fileData.length > 0 ? (
        <div
          className="ag-theme-alpine-dark"
          style={{ height: "500px", width: "100%" }}
        >
          <AgGridReact
            rowData={addSerialNumber(fileData)}
            columnDefs={getColumnDefs(fileData)}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      ) : (
        <p>No data available for {`${folder}/${file}`}</p>
      )}
    </div>
  );
};

export default FileView;
