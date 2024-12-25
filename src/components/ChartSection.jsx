import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importar el adaptador de fechas
import axios from "axios";

// Registrar los módulos necesarios, incluyendo PointElement y LineElement
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  LineElement,    // Registro del LineElement para gráficos de líneas
  PointElement    // Registro del PointElement para mostrar los puntos en el gráfico
);

const ChartSection = () => {
  const [chartData, setChartData] = useState(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
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
              label: "Precio de Bitcoin (Últimos 7 días)",
              data: prices,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();

    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy(); // Destruir el gráfico actual al desmontar
      }
    };
  }, []);

  if (!chartData) {
    return <p className="text-center">Cargando gráfico...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <Line
        ref={chartRef}
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
