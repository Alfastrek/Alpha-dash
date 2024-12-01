import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FileView from "./pages/FileView";
import "react-data-grid/lib/styles.css";
import Upload from "./pages/Upload";
import "./App.css";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:folder/:file" element={<FileView />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
