import Papa from "papaparse";

const loadCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
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
