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
  const [customTags, setCustomTags] = useState("");
  const [tagField, setTagField] = useState("");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);

  // AG-Grid Column Definitions
  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { field: "country" },
      { field: "year" },
      { field: "athlete" },
      { field: "sport" },
      { field: "total" },
    ],
    pagination: true,
    paginationPageSize: 10,
  });

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
    const dynamicColumns = Object.keys(data[0] || {}).map((key) => ({
      headerName: key,
      field: key,
      filter: true, // Enable filtering for all columns
      // You can customize filter types here if needed
    }));

    return [
      { field: "serialNumber", headerName: "S.No", width: 90 },
      ...dynamicColumns,
    ];
  };

  const addTagsToData = () => {
    if (!tagField || !customTags) return;
    const tagsArray = customTags.split(",").map((tag) => tag.trim());
    const updatedData = fileData.map((row, index) => ({
      ...row,
      [tagField]: tagsArray[index % tagsArray.length],
    }));
    setFileData(updatedData);
  };

  const getUniqueValuesForTagField = (field) => {
    if (!field) return;
    const values = fileData.map((row) => row[field]);
    const uniqueValues = [...new Set(values)];
    setUniqueTags(uniqueValues);
  };

  useEffect(() => {
    if (tagField) {
      getUniqueValuesForTagField(tagField);
    }
  }, [tagField, fileData]);

  const filteredFields = Object.keys(fileData[0] || {})
    .filter((key) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="file-view">
      <button
        onClick={() => navigate("/dashboard")}
        className="original-button-return"
      >
        Back to Home
      </button>
      <h2 className="file-title">{`${folder}/${file}`}</h2>

      {/* Toggle Button for Filter */}
      <button
        onClick={() => setFilterEnabled(!filterEnabled)}
        className="original-button-group-by"
      >
        {filterEnabled ? "Disable Filter" : "Enable Filter"}
      </button>

      {/* Custom Tag Input only when Filter is enabled */}
      {filterEnabled && (
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
              onChange={(e) => setTagField(e.target.value)}
              value={tagField}
              className="form-control"
            >
              <option value="">--Select Field--</option>
              {/* Dynamically generate options based on CSV fields */}
              {filteredFields.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          {/* Show unique tag values as a dropdown */}
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

          {/* Manually enter comma-separated tags */}
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
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={addSerialNumber(fileData)}
          columnDefs={getColumnDefs(fileData)}
          gridOptions={gridOptions}
          pagination={true}
          paginationPageSize={10}
          filterEnabled={filterEnabled}
        />
      </div>
    </div>
  );
};

export default FileView;
