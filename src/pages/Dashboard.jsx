import React from "react";
import Header from "../components/Header";
import CryptoList from "../components/CryptoList";
import ChartSection from "../components/ChartSection";
import NewsSection from "../components/NewsSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6 space-y-6">
        <CryptoList />
        <ChartSection />
        <NewsSection />
      </main>
    </div>
  );
};

export default Dashboard;
