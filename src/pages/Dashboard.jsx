import React, { useState, useRef } from "react";
import Header from "../components/Header";
import CryptoList from "../components/CryptoList";
import ChartSection from "../components/ChartSection";
import NewsSection from "../components/NewsSection";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const chartRef = useRef(null);

  const handleSelectCrypto = (cryptoId) => {
    setSelectedCrypto(cryptoId);

    // Scroll suave hacia el gráfico
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6 space-y-6">
        <CryptoList onSelectCrypto={handleSelectCrypto} />
        <div ref={chartRef}>
          <ChartSection selectedCrypto={selectedCrypto} />
        </div>
        <NewsSection />
      </main>
    </div>
  );
};

export default Dashboard;
