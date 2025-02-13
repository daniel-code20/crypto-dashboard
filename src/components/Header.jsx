import React from "react";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </header>
  );
};

export default Header;
