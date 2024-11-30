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
  const [customTags, setCustomTags] = useState(""); // Stores user-defined comma-separated tags
  const [tagField, setTagField] = useState(""); // Stores the current field for grouping by tags
  const [uniqueTags, setUniqueTags] = useState([]); // Stores unique values for tag field dropdown
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering dropdown options
  const [groupByEnabled, setGroupByEnabled] = useState(false); // State to track if "Group By" is enabled

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
      let columnDefs = [
        { headerName: "S.No", field: "serialNumber", width: 90 },
        ...Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
        })),
      ];

      return columnDefs;
    }
    return [];
  };

  // Function to add custom tags to the data
  const addTagsToData = () => {
    if (!tagField || !customTags) return;
    const tagsArray = customTags.split(",").map((tag) => tag.trim());
    const updatedData = fileData.map((row, index) => ({
      ...row,
      [tagField]: tagsArray[index % tagsArray.length], // Assign tags cyclically
    }));
    setFileData(updatedData);
  };

  // Function to extract unique values from the selected column for tags
  const getUniqueValuesForTagField = (field) => {
    if (!field) return;
    const values = fileData.map((row) => row[field]);
    const uniqueValues = [...new Set(values)];
    setUniqueTags(uniqueValues);
  };

  useEffect(() => {
    if (tagField) {
      getUniqueValuesForTagField(tagField); // Update unique values when tagField changes
    }
  }, [tagField, fileData]);

  // Filter function for search query
  const filteredFields = Object.keys(fileData[0] || {})
    .filter((key) => key.toLowerCase().includes(searchQuery.toLowerCase())) // Filter based on search query
    .sort(); // Sort alphabetically

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="file-view">
      <button onClick={() => navigate("/")} className="original-button-return">
        Back to Home
      </button>
      <h2 className="file-title">{`${folder}/${file}`}</h2>

      {/* Toggle Button for Group By */}
      <button
        onClick={() => setGroupByEnabled(!groupByEnabled)}
        className="original-button"
      >
        {groupByEnabled ? "Disable Group By" : "Enable Group By"}
      </button>

      {/* Custom Tag Input only when Group By is enabled */}
      {groupByEnabled && (
        <div className="tag-controls mb-3">
          <label>
            Select Field for Tags:
            <input
              type="text"
              placeholder="Search field Manually or Select from Dropdown"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Search query to filter dropdown options
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
          pagination={true}
          paginationPageSize={10}
          groupUseEntireRow={groupByEnabled} // Enable or disable grouping based on toggle
        />
      </div>
    </div>
  );
};

export default FileView;
