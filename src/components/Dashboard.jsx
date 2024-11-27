import { useState, useEffect } from "react";
import Tab from "./Tab";
import loadCSV from "../services/csvService";
import { TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Loader component
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
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const loadCSVFiles = async () => {
      const files = [
        "file1.csv",
        "file2.csv",
        "file3.csv",
        "file4.csv",
        "file5.csv",
      ];

      const data = {};
      for (const file of files) {
        const jsonFile = `/cache/${file.replace(".csv", ".json")}`;
        try {
          const response = await fetch(jsonFile);
          if (response.ok) {
            const cachedData = await loadCSV(`/csv/${file}`);
            console.log(`Loaded data for ${file}:`, cachedData); // Debugging output
            data[file] = cachedData;
          } else {
            console.log(`No cache found for ${file}, loading CSV...`);
            const loadedCSV = await loadCSV(`/csv/${file}`);
            data[file] = loadedCSV;
            console.log(`Parsed and loaded CSV for ${file}`);
          }
        } catch (error) {
          console.error(`Error loading ${file}:`, error);
        }
      }

      setCsvData(data);
      setActiveTab(files[0]);
      setIsLoading(false); // Set loading to false once data is fetched
    };

    loadCSVFiles();
  }, []);

  // Function to add serial number to the data
  const addSerialNumber = (data) => {
    return data.map((row, index) => ({
      ...row,
      serialNumber: index + 1, // Adding 1 to index to start from 1
    }));
  };

  const getColumnDefs = (data) => {
    if (Array.isArray(data) && data.length > 0 && data[0]) {
      return [
        { headerName: "S.No", field: "serialNumber", width: 90 }, // Add serial number column
        ...Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
        })),
      ];
    }
    return []; // Return empty column defs if the data is not valid
  };

  // Configure Infinite Row Model
  const getRowData = (file) => {
    return {
      getRows: (params) => {
        // Get rows from CSV data (or API) based on the current request
        const rowsThisBlock = csvData[file].slice(
          params.startRow,
          params.endRow
        );
        const lastRow =
          rowsThisBlock.length < params.endRow - params.startRow
            ? params.startRow + rowsThisBlock.length
            : -1;
        params.successCallback(rowsThisBlock, lastRow);
      },
    };
  };

  if (isLoading) {
    return <Loader />; // Show loader while data is being loaded
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">CSV Report Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="tabs-container">
            <TabList className="list-group">
              {Object.keys(csvData).map((file) => (
                <Tab
                  key={file}
                  label={file}
                  isActive={file === activeTab}
                  onClick={() => setActiveTab(file)}
                />
              ))}
            </TabList>
          </div>
        </div>

        <div className="col-md-9">
          {Object.keys(csvData).map((file) => (
            <TabPanel key={file} selected={file === activeTab}>
              {csvData[file] && (
                <div
                  className="ag-theme-alpine"
                  style={{ height: "500px", width: "1150px" }}
                >
                  <h3>{file}</h3>
                  {csvData[file].length > 0 ? (
                    <AgGridReact
                      rowModelType="infinite"
                      cacheBlockSize={50} // Number of rows per block to load
                      rowData={addSerialNumber(csvData[file])}
                      columnDefs={getColumnDefs(csvData[file])}
                      pagination={true}
                      paginationPageSize={10}
                      infiniteInitialRowCount={500} // Initial number of rows to load (set according to your data)
                      datasource={getRowData(file)}
                    />
                  ) : (
                    <p>No data available for {file}</p>
                  )}
                </div>
              )}
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
