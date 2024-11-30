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
  const [showGroupBy, setShowGroupBy] = useState(false); // Toggle for "Group By" section
  const [selectedField, setSelectedField] = useState(""); // Selected field for grouping
  const [customTags, setCustomTags] = useState(""); // Stores user-defined comma-separated tags
  const [tagField, setTagField] = useState(""); // Stores the current field for grouping by tags

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

  const getColumnDefs = (data, selectedField) => {
    if (Array.isArray(data) && data.length > 0 && data[0]) {
      let columnDefs = [
        { headerName: "S.No", field: "serialNumber", width: 90 },
        ...Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
        })),
      ];

      // Add grouping for selected field
      if (selectedField) {
        columnDefs.unshift({
          headerName:
            selectedField.charAt(0).toUpperCase() + selectedField.slice(1),
          field: selectedField,
          rowGroup: true,
          hide: true,
        });
      }

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="file-view">
      <button onClick={() => navigate("/")} className="btn btn-primary mb-3">
        Back to Home
      </button>
      <h2 className="file-title">{`${folder}/${file}`}</h2>

      {/* Group By Toggle */}
      <button
        onClick={() => setShowGroupBy(!showGroupBy)}
        className="original-button"
      >
        {showGroupBy ? "Hide Group By" : "Apply Group By"}
      </button>

      {/* Conditionally render Group By and Tag Input sections */}
      {showGroupBy && (
        <div>
          <div className="grouping-controls mb-3">
            <label>
              Group by:
              <select
                onChange={(e) => setSelectedField(e.target.value)}
                value={selectedField}
              >
                <option value="">--Select Grouping Field--</option>
                <option value="date">Date</option>
                <option value="tags">Tags</option>}
              </select>
            </label>
          </div>

          {/* Custom Tag Input */}
          <div className="tag-controls mb-3">
            <label>
              Select Field for Tags:
              <select
                onChange={(e) => setTagField(e.target.value)}
                value={tagField}
              >
                <option value="">--Select Field--</option>
                {/* Dynamically generate options based on CSV fields */}
                {Object.keys(fileData[0] || {}).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            <input
              type="text"
              placeholder="Enter comma-separated tags"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              className="form-control mt-2"
            />
            <button
              onClick={addTagsToData}
              className="original-button-group-by"
            >
              Apply Tags
            </button>
          </div>
        </div>
      )}

      <div
        className="ag-theme-alpine-dark"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={addSerialNumber(fileData)}
          columnDefs={getColumnDefs(fileData, selectedField)}
          pagination={true}
          paginationPageSize={10}
          groupUseEntireRow={true}
        />
      </div>
    </div>
  );
};

export default FileView;
