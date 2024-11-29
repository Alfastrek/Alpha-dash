import Papa from "papaparse";

// Function to load and parse CSV file
const loadCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        reject(error);
      },
      header: true,
    });
  });
};

export default loadCSV;
