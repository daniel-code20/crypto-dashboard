const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/cryptos/market_chart', async (req, res) => {
  const { id, vs_currency, days } = req.query;

  try {
    // Realiza la solicitud a la API de CoinGecko con el id de la cripto seleccionada
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: vs_currency || "usd", // Default to USD if not provided
          days: days || "7", // Default to 7 days if not provided
        },
      }
    );
    
    // Responde con los datos de la API de CoinGecko
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ error: 'Error al obtener los datos del gráfico' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
