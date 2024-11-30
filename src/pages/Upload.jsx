import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loader from "../components/Loader"; // Reuse your loader component
import loadCSV from "../services/csvService"; // Import loadCSV from csvService.js
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [csvData, setCsvData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customTags, setCustomTags] = useState("");
  const [tagField, setTagField] = useState("");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByEnabled, setGroupByEnabled] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file) {
      setFileName(file.name);
    }

    setIsLoading(true);

    // Using loadCSV from csvService.js
    loadCSV(file)
      .then((result) => {
        const columns = result[0]
          ? Object.keys(result[0]).map((key) => ({
              headerName: key,
              field: key,
            }))
          : [];

        setColumnDefs(columns);
        setCsvData(result.slice(1));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error parsing CSV file:", error);
        setIsLoading(false);
      });
  };

  // Grouping functionality
  const addTagsToData = () => {
    if (!tagField || !customTags) return;
    const tagsArray = customTags.split(",").map((tag) => tag.trim());
    const updatedData = csvData.map((row, index) => ({
      ...row,
      [tagField]: tagsArray[index % tagsArray.length], // Assign tags cyclically
    }));
    setCsvData(updatedData);
  };

  // Extract unique tag values from a selected column
  const getUniqueValuesForTagField = (field) => {
    if (!field) return;
    const values = csvData.map((row) => row[field]);
    const uniqueValues = [...new Set(values)];
    setUniqueTags(uniqueValues);
  };

  const filteredFields = Object.keys(csvData[0] || {})
    .filter((key) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort();

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
          style={{ width: "110px" }} // Adjust the width as needed
        />
        {fileName && <span style={{ marginLeft: "10px" }}>{fileName}</span>}
        <button
          onClick={() => setGroupByEnabled(!groupByEnabled)}
          className="original-button-group-by"
          style={{ alignSelf: "flex-start", marginLeft: "900px" }} // Align the button to the left
        >
          {groupByEnabled ? "Disable Group By" : "Enable Group By"}
        </button>
      </div>

      {fileName && groupByEnabled && (
        <div className="tag-controls mb-3">
          <label style={{ color: "#000000" }}>
            Select Field for Tags:
            <input
              type="text"
              placeholder="Search field Manually or Select from Dropdown"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mb-2"
            />
            <select
              onChange={(e) => {
                setTagField(e.target.value);
                getUniqueValuesForTagField(e.target.value);
              }}
              value={tagField}
              className="form-control"
            >
              <option value="">--Select Field--</option>
              {filteredFields.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          {tagField && (
            <div>
              <label>Select Tag from the list:</label>
              <select
                onChange={(e) => setCustomTags(e.target.value)}
                value={customTags}
                className="form-control mb-2"
              >
                <option value="">--Select Tag--</option>
                {uniqueTags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            type="text"
            placeholder="Enter comma-separated tags (Manually)"
            value={customTags}
            onChange={(e) => setCustomTags(e.target.value)}
            className="form-control mt-2"
          />
          <button onClick={addTagsToData} className="original-button-group-by">
            Apply Tags
          </button>
        </div>
      )}

      <div
        className="ag-theme-alpine-dark"
        style={{ height: "500px", width: "100%", marginTop: "20px" }}
      >
        <AgGridReact
          rowData={csvData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          groupUseEntireRow={groupByEnabled}
        />
      </div>
    </div>
  );
};

export default Upload;
