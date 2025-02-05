const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/cryptos', async (req, res) => {
  const { id, vs_currency, days } = req.query;

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: req.query.vs_currency || 'usd',
        order: req.query.order || 'market_cap_desc',
        per_page: req.query.per_page || 10,
        page: req.query.page || 1,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    res.status(500).send({ error: 'Error al obtener las criptomonedas' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors({ origin: '*' }));

