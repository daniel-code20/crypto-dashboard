import React, { useEffect, useState, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const ChartSection = ({ selectedCrypto, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const lineSeriesRef = useRef(null);

  // Función para obtener los datos del gráfico
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setError(null); // Limpiar errores previos
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,
          { params: { vs_currency: "usd", days: "7" } }
        );

        const prices = response.data.prices.map((price) => ({
          time: price[0] / 1000, // Convertir el timestamp a segundos
          value: price[1],
        }));

        setChartData(prices);
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1000);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("No se pudo cargar el gráfico. Inténtalo de nuevo.");
      }
    };

    fetchChartData();
  }, [selectedCrypto]);

  // Efecto para crear/destruir el gráfico cuando cambia el modo oscuro/claro o los datos
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Destruir el gráfico existente si hay uno
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      lineSeriesRef.current = null;
    }

    // Crear el gráfico
    const chartContainer = chartContainerRef.current;
    chartRef.current = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: chartContainer.clientHeight,
      layout: {
        textColor: darkMode ? "#ffffff" : "#000000", // Color del texto
        background: {
          type: "solid",
          color: darkMode ? "#1a202c" : "#ffffff", // Fondo oscuro o claro
        },
      },
      grid: {
        vertLines: { color: darkMode ? "#4a5568" : "#e2e8f0" }, // Líneas verticales
        horzLines: { color: darkMode ? "#4a5568" : "#e2e8f0" }, // Líneas horizontales
      },
    });

    // Añadir la serie de datos
    lineSeriesRef.current = chartRef.current.addLineSeries({
      color: darkMode ? "#48bb78" : "#3182ce", // Color de la línea (verde para dark mode, azul para light mode)
      lineWidth: 2,
    });

    // Si hay datos, establecerlos en la serie
    if (chartData) {
      lineSeriesRef.current.setData(chartData);
      chartRef.current.timeScale().fitContent();
    }

    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove(); // Destruir el gráfico
        chartRef.current = null;
        lineSeriesRef.current = null;
      }
    };
  }, [chartData, darkMode]); // Dependencias: chartData y darkMode

  // Mostrar errores
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Mostrar un spinner mientras se cargan los datos
  if (!chartData) {
    return (
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-auto rounded-lg p-6">
        <svg className="text-gray-300 animate-spin" viewBox="0 0 64 64" width="24" height="24">
          <path d="M32 3C35.8 3 39.6 3.75 43.1 5.2C46.6 6.66 49.8 8.8 52.5 11.5C55.2 14.2 57.3 17.4 58.8 20.9C60.2 24.4 61 28.2 61 32C61 35.8 60.2 39.6 58.8 43.1C57.3 46.6 55.2 49.8 52.5 52.5C49.8 55.2 46.6 57.3 43.1 58.8C39.6 60.2 35.8 61 32 61C28.2 61 24.4 60.2 20.9 58.8C17.4 57.3 14.2 55.2 11.5 52.5C8.8 49.8 6.66 46.6 5.2 43.1C3.75 39.6 3 35.8 3 32C3 28.2 3.75 24.4 5.2 20.9C6.66 17.4 8.8 14.2 11.5 11.5C14.2 8.8 17.4 6.66 20.9 5.2C24.4 3.75 28.2 3 32 3Z" stroke="currentColor" strokeWidth="5"></path>
        </svg>
      </div>
    );
  }

  // Renderizar el contenedor del gráfico
  return (
    <div
      ref={chartContainerRef}
      className={`p-4 shadow-lg rounded-md flex-1 transition-all duration-500 
        ${isHighlighted ? "bg-teal-100" : ""} 
        ${darkMode ? "bg-gray-800" : "bg-white"}
        w-full h-[300px] sm:h-[400px] lg:h-[500px]`}
    ></div>
  );
};

export default ChartSection;