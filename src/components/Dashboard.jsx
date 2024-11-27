import { useState, useEffect } from "react";
import Tab from "./Tab"; // Folder/File Tab Component
import loadCSV from "../services/csvService"; // Service to load CSV data
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Loader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [csvData, setCsvData] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCSVFiles = async () => {
      const folderStructure = {
        folder1: ["a.csv", "b.csv", "c.csv"],
        folder2: ["d.csv", "e.csv", "f.csv"],
        folder3: ["g.csv", "h.csv", "i.csv"],
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
      setActiveFolder("folder1"); // Set default folder
      setActiveFile("a.csv"); // Set default file
    };

    loadCSVFiles();
  }, []);

  const addSerialNumber = (data) => {
    return data.map((row, index) => ({
      ...row,
      serialNumber: index + 1,
    }));
  };

  const getColumnDefs = (data) => {
    if (Array.isArray(data) && data.length > 0 && data[0]) {
      return [
        { headerName: "S.No", field: "serialNumber", width: 90 },
        ...Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
        })),
      ];
    }
    return [];
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">CSV Report Dashboard</h2>
      <div className="row">
        <nav className="col-md-3">
          {Object.keys(csvData).map((folder) => (
            <Tab
              key={folder}
              label={folder}
              isActive={folder === activeFolder}
              onClick={() => {
                setActiveFolder(folder);
                setActiveFile(Object.keys(csvData[folder])[0]);
              }}
              isFolderTab={true}
            />
          ))}
          {activeFolder && (
            <section className="mt-3">
              {Object.keys(csvData[activeFolder]).map((file) => (
                <Tab
                  key={file}
                  label={file}
                  isActive={file === activeFile}
                  onClick={() => setActiveFile(file)}
                  isFolderTab={false}
                />
              ))}
            </section>
          )}
        </nav>
        <section className="col-md-9">
          {activeFolder && activeFile && csvData[activeFolder][activeFile] && (
            <article
              className="ag-theme-alpine-dark"
              style={{ height: "500px", width: "100%" }}
            >
              <h3 className="text-center mb-3">{activeFile}</h3>
              {csvData[activeFolder][activeFile].length > 0 ? (
                <AgGridReact
                  rowData={addSerialNumber(csvData[activeFolder][activeFile])}
                  columnDefs={getColumnDefs(csvData[activeFolder][activeFile])}
                  pagination={true}
                  paginationPageSize={10}
                />
              ) : (
                <p>No data available for {activeFile}</p>
              )}
            </article>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
