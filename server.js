const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/cryptos', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: req.query,
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener datos' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
