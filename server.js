const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());
app.use(express.json());

const cache = new NodeCache({ stdTTL: 60 }); // Caché de 60 segundos

// Ruta para obtener los datos del gráfico de una criptomoneda
app.get("/api/crypto-chart", async (req, res) => {
  const { id, vs_currency = "usd", days = "7" } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Se requiere un ID de criptomoneda" });
  }

  const cacheKey = `chart-${id}-${vs_currency}-${days}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      { params: { vs_currency, days } }
    );

    cache.set(cacheKey, response.data); // Guardar en caché
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching chart data:", error.message);
    res.status(500).json({ error: "Error al obtener los datos del gráfico" });
  }
});

// Ruta para obtener la lista de criptomonedas
app.get("/api/cryptos", async (req, res) => {
  const { vs_currency = "usd", order = "market_cap_desc", per_page = 10, page = 1 } = req.query;

  const cacheKey = `cryptos-${vs_currency}-${order}-${per_page}-${page}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      { params: { vs_currency, order, per_page, page } }
    );

    cache.set(cacheKey, response.data); // Guardar en caché
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching cryptos:", error.message);
    res.status(500).json({ error: "Error al obtener las criptomonedas" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
