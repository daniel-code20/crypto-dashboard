import React, { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const ChartSection = ({ selectedCrypto }) => {
  const [chartData, setChartData] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Ahora usamos tu servidor en lugar de CoinGecko directamente
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,
          {
            params: {
              id: selectedCrypto, // Se espera un parámetro 'id' para la cripto seleccionada
              vs_currency: "usd",
              days: "7",
            },
          }
        );

        // Asumimos que la respuesta de tu servidor contiene los datos de la cripto seleccionada
        const prices = response.data.prices.map((price) => ({
          time: price[0] / 1000, // Convierte el timestamp a segundos
          value: price[1],
        }));

        setChartData(prices);

        // Activar el efecto de resalte
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1000); // Desactivar después de 1 segundo
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [selectedCrypto]);

  useEffect(() => {
    if (chartData) {
      const chartContainer = document.getElementById("chartContainer");

      const chart = createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        layout: {
          textColor: "black",
          background: { type: "solid", color: "white" },
        },
        crosshair: {
          vertLine: {
            color: "#758696",
            width: 1,
            style: 1,
          },
          horzLine: {
            color: "#758696",
            width: 1,
            style: 1,
          },
        },
        grid: {
          vertLines: {
            color: "#eeeeee",
            style: 1,
            visible: true,
          },
          horzLines: {
            color: "#eeeeee",
            style: 1,
            visible: true,
          },
        },
      });

      const lineSeries = chart.addLineSeries({
        color: "rgba(75,192,192,1)",
        lineWidth: 2,
      });

      lineSeries.setData(chartData);

      chart.timeScale().fitContent();
    }
  }, [chartData]);

  if (!chartData) {
    return (
      <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <svg
          class="text-gray-300 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-900"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div
      id="chartContainer"
      className={`p-6 bg-white shadow-lg rounded-md flex-1 transition-all duration-500 ${
        isHighlighted ? "bg-teal-100" : "bg-white"
      }`}
      style={{ position: "relative", width: "100%", height: "400px" }} // Asegúrate de que el contenedor tenga un tamaño
    ></div>
  );
};

export default ChartSection;
