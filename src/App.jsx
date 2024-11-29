import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FileView from "./pages/FileView";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:folder/:file" element={<FileView />} />
      </Routes>
    </Router>
  );
}

export default App;
