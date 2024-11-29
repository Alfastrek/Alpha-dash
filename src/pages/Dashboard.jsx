import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import loadCSV from "../services/csvService";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loader from "../components/Loader"; // Import the reusable loader
import ToggleButton from "../components/ToggleButton";
import CsvPreview from "../components/CsvPreview"; // Import the ToggleButton component

const Dashboard = () => {
  const [csvData, setCsvData] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileStatus, setFileStatus] = useState({}); // Store file status in state
  const navigate = useNavigate();

  // Load CSV files and their data
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

  // Load file status from localStorage
  useEffect(() => {
    const savedFileStatus = localStorage.getItem("fileStatus");
    if (savedFileStatus) {
      setFileStatus(JSON.parse(savedFileStatus)); // Parse and set the saved file status
    }
  }, []);

  // Save file status to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(fileStatus).length > 0) {
      localStorage.setItem("fileStatus", JSON.stringify(fileStatus)); // Save to localStorage
    }
  }, [fileStatus]);

  // Toggle the active/inactive status of a file
  const toggleFileStatus = (folder, file) => {
    setFileStatus((prevStatus) => {
      const newStatus = {
        ...prevStatus,
        [folder]: {
          ...prevStatus[folder],
          [file]: !prevStatus[folder]?.[file], // Toggle the status
        },
      };
      return newStatus;
    });
  };

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

  const handleFileClick = (folder, file) => {
    navigate(`/${folder}/${file}`); // Navigate to the file page
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
                  {Object.keys(csvData[folder]).map((file) => {
                    const isActive = fileStatus[folder]?.[file] !== false; // Check if the file is active
                    return (
                      <li
                        key={file}
                        className={`file-item ${
                          isActive ? "active" : "inactive"
                        }`}
                      >
                        {file}
                        <ToggleButton
                          checked={isActive} // Pass the active status to ToggleButton
                          onChange={() => toggleFileStatus(folder, file)} // Toggle the file status on change
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {activeFolder && (
          <div className="file-grid">
            {Object.keys(csvData[activeFolder]).map((file) => {
              const isActive = fileStatus[activeFolder]?.[file] !== false;
              return (
                isActive && (
                  <div
                    key={file}
                    className="file-section"
                    onClick={() => handleFileClick(activeFolder, file)}
                  >
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
                )
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
