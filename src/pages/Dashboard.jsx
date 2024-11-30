import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import loadCSV from "../services/csvService";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ToggleButton from "../components/ToggleButton";
import DataGrid from "react-data-grid";

import "react-data-grid/lib/styles.css";

const Dashboard = () => {
  const [csvData, setCsvData] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileStatus, setFileStatus] = useState({}); // Store file status in state
  const [previewData, setPreviewData] = useState({}); // Store preview data for CSV files
  const [folderLoading, setFolderLoading] = useState(false); // State to track folder loading
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
      const preview = {}; // Object to hold preview data

      for (const folder in folderStructure) {
        data[folder] = {};
        preview[folder] = {}; // Initialize preview for the folder
        for (const file of folderStructure[folder]) {
          try {
            const parsedData = await loadCSV(`/csv/${folder}/${file}`);
            data[folder][file] = parsedData;
            preview[folder][file] = parsedData.slice(0, 10); // Only get the first 10 rows for preview
          } catch (error) {
            console.error(`Error loading ${file}:`, error);
          }
        }
      }

      setCsvData(data);
      setPreviewData(preview); // Set the preview data
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

  // Handle click on a file to navigate to its detailed view
  const handleFileClick = (folder, file) => {
    navigate(`/${folder}/${file}`); // Navigate to the file page
  };

  // When switching folders, set folderLoading to true
  const handleFolderChange = (folder) => {
    setFolderLoading(true);
    setActiveFolder(folder);
    setTimeout(() => setFolderLoading(false), 300); // Simulate loading delay (for demo purposes)
  };

  if (isLoading || folderLoading) {
    return <Loader size={60} color="#4caf50" />; // Show loader while loading folder or data
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Pick your Files:</h1>
      <div className="dashboard-content">
        <nav className="dashboard-nav floating-sidebar">
          {Object.keys(csvData).map((folder) => (
            <div key={folder} className="folder-container">
              <Tab
                label={folder}
                isActive={folder === activeFolder}
                onClick={() => handleFolderChange(folder)}
                isFolderTab={true}
              />
              {activeFolder === folder && (
                <ul className="file-list">
                  {Object.keys(csvData[folder]).map((file) => {
                    const isActive = fileStatus[folder]?.[file] !== false;
                    return (
                      <li
                        key={file}
                        className={`file-item ${
                          isActive ? "active" : "inactive"
                        }`}
                      >
                        {file}
                        <ToggleButton
                          checked={isActive}
                          onChange={() => toggleFileStatus(folder, file)}
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
                    <div className="grid-container">
                      <DataGrid
                        columns={
                          previewData[activeFolder][file]?.length > 0
                            ? Object.keys(
                                previewData[activeFolder][file][0]
                              ).map((key) => ({
                                key: key,
                                name: key,
                                resizable: true,
                              }))
                            : []
                        }
                        rows={previewData[activeFolder][file] || []}
                        rowHeight={35}
                        pagination={true}
                        paginationPageSize={5}
                        onRowsChange={(rows) =>
                          setPreviewData({
                            ...previewData,
                            [activeFolder]: { [file]: rows },
                          })
                        }
                        style={{ width: "100%" }}
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
