import React, { useEffect, useState } from "react";
import axios from "axios";

const CryptoList = ({ onSelectCrypto }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
            },
          }
        );
        setCryptos(response.data);
      } catch (error) {
        console.error("Error fetching cryptos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cryptos.map((crypto) => (
        <div
          key={crypto.id}
          className="p-4 bg-white rounded shadow hover:shadow-lg"
          onClick={() => onSelectCrypto(crypto.id)}
        >
          <h2 className="font-bold text-lg">{crypto.name}</h2>
          <p>Precio: ${crypto.current_price.toLocaleString()}</p>
          <p>Capitalización: ${crypto.market_cap.toLocaleString()}</p>
          <p>Cambio 24h: {crypto.price_change_percentage_24h.toFixed(2)}%</p>
        </div>
      ))}
    </div>
  );
};

export default CryptoList;
