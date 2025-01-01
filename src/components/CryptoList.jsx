import React, { useEffect, useState } from "react";
import axios from "axios";

const CryptoList = ({ onSelectCrypto }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        // Revisar caché local
        const cachedData = localStorage.getItem("cryptos");
        const lastFetch = localStorage.getItem("lastFetchTime");

        if (cachedData && lastFetch && Date.now() - lastFetch < 60 * 1000) {
          setCryptos(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Llamada a la API
        const response = await axios.get("http://localhost:4000/api/cryptos", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
          },
        });

        setCryptos(response.data);
        localStorage.setItem("cryptos", JSON.stringify(response.data));
        localStorage.setItem("lastFetchTime", Date.now());
      } catch (error) {
        console.error("Error fetching cryptos:", error);
        setError(
          "No se pudieron cargar las criptomonedas. Por favor, inténtalo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleSelectCrypto = (id) => {
    onSelectCrypto(id);

    // Desplazar suavemente hacia la gráfica
    const chartSection = document.getElementById("chart-section");
    chartSection?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="p-4 bg-gray-200 rounded shadow animate-pulse"
          >
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cryptos.map((crypto) => (
        <div
          key={crypto.id}
          className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col items-start"
          onClick={() => handleSelectCrypto(crypto.id)}
        >
          {/* Logo e Información */}
          <div className="flex items-center gap-4 mb-2">
            <img
              src={crypto.image}
              alt={`${crypto.name} logo`}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="font-bold text-lg">{crypto.name}</h2>
          </div>
          {/* Detalles */}
          <p>Precio: ${crypto.current_price.toLocaleString()}</p>
          <p>Capitalización: ${crypto.market_cap.toLocaleString()}</p>
          <p
            className={`${
              crypto.price_change_percentage_24h > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            Cambio 24h: {crypto.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default CryptoList;
