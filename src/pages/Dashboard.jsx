import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "../components/Header";
import CryptoList from "../components/CryptoList";
import ChartSection from "../components/ChartSection";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const chartRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSelectCrypto = useCallback((cryptoId) => {
    setSelectedCrypto(cryptoId);
    setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="p-6 space-y-6">
        <CryptoList onSelectCrypto={handleSelectCrypto} />
        <div ref={chartRef}>
          <ChartSection key={selectedCrypto} selectedCrypto={selectedCrypto} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
