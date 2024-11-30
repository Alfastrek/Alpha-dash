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
  const [fileStatus, setFileStatus] = useState({});
  const [previewData, setPreviewData] = useState({});
  const [folderLoading, setFolderLoading] = useState(false);
  const [tags, setTags] = useState({}); // New state to store tags for each file
  const navigate = useNavigate();

  useEffect(() => {
    const loadCSVFiles = async () => {
      const folderStructure = {
        folder1: ["a.csv", "b.csv", "c.csv", "d.csv"],
        folder2: ["e.csv", "f.csv", "g.csv", "h.csv"],
        folder3: ["i.csv", "j.csv", "k.csv", "l.csv"],
      };

      const data = {};
      const preview = {};

      for (const folder in folderStructure) {
        data[folder] = {};
        preview[folder] = {};
        for (const file of folderStructure[folder]) {
          try {
            const parsedData = await loadCSV(`/csv/${folder}/${file}`);
            data[folder][file] = parsedData;
            preview[folder][file] = parsedData.slice(0, 10);
          } catch (error) {
            console.error(`Error loading ${file}:`, error);
          }
        }
      }

      setCsvData(data);
      setPreviewData(preview);
      setIsLoading(false);
    };

    loadCSVFiles();
  }, []);

  useEffect(() => {
    const savedFileStatus = localStorage.getItem("fileStatus");
    if (savedFileStatus) {
      setFileStatus(JSON.parse(savedFileStatus));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(fileStatus).length > 0) {
      localStorage.setItem("fileStatus", JSON.stringify(fileStatus));
    }
  }, [fileStatus]);

  // Load and save tags in localStorage
  useEffect(() => {
    const savedTags = localStorage.getItem("fileTags");
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(tags).length > 0) {
      localStorage.setItem("fileTags", JSON.stringify(tags));
    }
  }, [tags]);

  const toggleFileStatus = (folder, file) => {
    setFileStatus((prevStatus) => {
      const newStatus = {
        ...prevStatus,
        [folder]: {
          ...prevStatus[folder],
          [file]: !prevStatus[folder]?.[file],
        },
      };
      return newStatus;
    });
  };

  const handleFileClick = (folder, file) => {
    navigate(`/${folder}/${file}`);
  };

  const handleFolderChange = (folder) => {
    setFolderLoading(true);
    setActiveFolder(folder);
    setTimeout(() => setFolderLoading(false), 300);
  };

  const handleTagChange = (folder, file, tag) => {
    setTags((prevTags) => {
      const newTags = { ...prevTags };
      if (!newTags[folder]) newTags[folder] = {};
      newTags[folder][file] = tag;
      return newTags;
    });
  };

  if (isLoading || folderLoading) {
    return <Loader size={60} color="#4caf50" />;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Pick your Selection</h1>
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
                        {/* Add an input field for tags */}
                        <input
                          type="text"
                          placeholder="Tags"
                          value={tags[folder]?.[file] || ""}
                          onChange={(e) =>
                            handleTagChange(folder, file, e.target.value)
                          }
                          style={{
                            marginTop: "10px",
                            height: "20px",
                            width: "60px",
                            padding: "10px",
                            fontSize: "14px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="original-button-return"
              style={{ color: "black" }}
            >
              Go Back
            </button>
          </div>
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
                    <h4 className="file-name">
                      {file}{" "}
                      {tags[activeFolder]?.[file] && (
                        <span className="tag">
                          ({tags[activeFolder][file]})
                        </span>
                      )}
                    </h4>
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
