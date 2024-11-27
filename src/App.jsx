import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard";
import "./App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const App = () => {
  return (
    <div className="app">
      <h1>Dynamic Report Dashboard</h1>
      <Dashboard />
    </div>
  );
};

export default App;
