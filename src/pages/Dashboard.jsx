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
  const [tags, setTags] = useState({});
  const [folderColors, setFolderColors] = useState({});
  const navigate = useNavigate();

  const getFolderColorsFromLocalStorage = () => {
    const savedColors = localStorage.getItem("folderColors");
    return savedColors ? JSON.parse(savedColors) : {};
  };

  const saveFolderColorsToLocalStorage = (colors) => {
    localStorage.setItem("folderColors", JSON.stringify(colors));
  };

  useEffect(() => {
    const savedColors = getFolderColorsFromLocalStorage();
    setFolderColors(savedColors);

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

  const handleFolderChange = (folder) => {
    setFolderLoading(true);
    setActiveFolder(folder);
    setTimeout(() => setFolderLoading(false), 300);
  };

  const handleColorSelect = (folder, color) => {
    const newColors = { ...folderColors, [folder]: color };
    setFolderColors(newColors);
    saveFolderColorsToLocalStorage(newColors);
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
                color={folderColors[folder]}
                onColorSelect={(color) => handleColorSelect(folder, color)}
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
                          onChange={() =>
                            setFileStatus((prevStatus) => {
                              const newStatus = {
                                ...prevStatus,
                                [folder]: {
                                  ...prevStatus[folder],
                                  [file]: !prevStatus[folder]?.[file],
                                },
                              };
                              return newStatus;
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="InputTags"
                          value={tags[folder]?.[file] || ""}
                          onChange={(e) =>
                            setTags((prevTags) => {
                              const newTags = { ...prevTags };
                              if (!newTags[folder]) newTags[folder] = {};
                              newTags[folder][file] = e.target.value;
                              return newTags;
                            })
                          }
                          style={{
                            marginTop: "10px",
                            height: "20px",
                            width: "60px",
                            padding: "10px",
                            fontSize: "9px",
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
                    onClick={() => navigate(`/${activeFolder}/${file}`)}
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
                              }))
                            : []
                        }
                        rows={previewData[activeFolder][file] || []}
                        rowKey="id"
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
