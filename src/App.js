import "./App.css";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
