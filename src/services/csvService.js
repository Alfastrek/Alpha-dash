import Papa from "papaparse";

// Function to load and parse CSV file
const loadCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      download: true, // Ensure the download option is enabled
      complete: (result) => {
        resolve(result.data); // Return the parsed data
      },
      error: (error) => {
        reject(error); // Handle any parsing errors
      },
      header: true, // Treat first row as headers
    });
  });
};

export default loadCSV;
