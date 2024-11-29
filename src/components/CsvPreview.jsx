// CsvPreview.js (Updated)
import React from "react";

// This component will display the preview of the CSV (first few rows)
const CsvPreview = ({ fileName, previewData, onClick }) => {
  return (
    <div className="csv-preview" onClick={onClick}>
      <div className="csv-preview-header">
        <h4>{fileName}</h4>
      </div>
      <div className="csv-preview-body">
        {previewData ? (
          <ul>
            {previewData.map((row, index) => (
              <li key={index}>{Object.values(row).join(", ")}</li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default CsvPreview;
