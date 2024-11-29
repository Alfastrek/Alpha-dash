import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import loadCSV from "../services/csvService";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loader from "../components/Loader";
import ToggleButton from "../components/ToggleButton";
const Dashboard = () => {
  const [csvData, setCsvData] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileStatuses, setFileStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadCSVFiles = async () => {
      const folderStructure = {
        folder1: ["a.csv", "b.csv", "c.csv", "d.csv"],
        folder2: ["e.csv", "f.csv", "g.csv", "h.csv"],
        folder3: ["i.csv", "j.csv", "k.csv", "l.csv"],
      };

      const data = {};
      for (const folder in folderStructure) {
        data[folder] = {};
        for (const file of folderStructure[folder]) {
          try {
            const parsedData = await loadCSV(`/csv/${folder}/${file}`);
            data[folder][file] = parsedData;
          } catch (error) {
            console.error(`Error loading ${file}:`, error);
          }
        }
      }

      setCsvData(data);
      setIsLoading(false);
    };

    loadCSVFiles();
  }, []);

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

  const handleToggleChange = (folder, file, e) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent button
    setFileStatuses((prevState) => ({
      ...prevState,
      [`${folder}-${file}`]: !prevState[`${folder}-${file}`], // Toggle the file's active state
    }));
  };

  if (isLoading) {
    return <Loader size={60} color="#4caf50" />;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">CSV Report Dashboard</h2>
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          {Object.keys(csvData).map((folder) => (
            <div key={folder} className="folder-container">
              <Tab
                label={folder}
                isActive={folder === activeFolder}
                onClick={() => setActiveFolder(folder)}
                isFolderTab={true}
              />
              {activeFolder === folder && (
                <ul className="file-list">
                  {Object.keys(csvData[folder]).map((file) => (
                    <li key={file} className="file-item">
                      <button
                        onClick={() => navigate(`/${folder}/${file}`)}
                        className="file-link"
                      >
                        {file}
                      </button>
                      <div className="toggle-button-wrapper">
                        <ToggleButton
                          checked={fileStatuses[`${folder}-${file}`] || false}
                          onChange={(e) => handleToggleChange(folder, file, e)} // Pass `e` to handle toggle
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {activeFolder && (
          <div className="file-grid">
            {Object.keys(csvData[activeFolder]).map((file) => (
              <div key={file} className="file-section">
                <h4 className="file-name">{file}</h4>
                <div
                  className="ag-theme-alpine-dark"
                  style={{
                    height: "200px",
                    width: "100%",
                  }}
                >
                  <AgGridReact
                    rowData={addSerialNumber(csvData[activeFolder][file])}
                    columnDefs={getColumnDefs(csvData[activeFolder][file])}
                    pagination={true}
                    paginationPageSize={5}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
