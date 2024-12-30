import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const ChartSection = ({ selectedCrypto }) => {
  const [chartData, setChartData] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: "7",
            },
          }
        );
        const prices = response.data.prices.map((price) => ({
          x: new Date(price[0]),
          y: price[1],
        }));
        setChartData({
          datasets: [
            {
              label: `Precio de ${selectedCrypto} (Últimos 7 días)`,
              data: prices,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
          ],
        });

        // Activar el efecto de resalte
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1000); // Desactivar después de 1 segundo
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [selectedCrypto]);

  if (!chartData) {
    return <p className="text-center">Cargando gráfico...</p>;
  }

  return (
    <div
      className={`p-6 bg-white shadow-lg rounded-md flex-1 transition-all duration-500 ${
        isHighlighted ? "bg-teal-100" : "bg-white"
      }`}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: { unit: "day" },
            },
            y: { beginAtZero: false },
          },
        }}
      />
    </div>
  );
};

export default ChartSection;
