const express = require('express');
const router = express.Router();

router.get('/:monto', async (req, res) => {
  try {
    const monto = parseFloat(req.params.monto);
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/MXN`);
    const data = await response.json();

    res.json({
      MXN: monto,
      USD: (monto * data.conversion_rates.USD).toFixed(2),
      EUR: (monto * data.conversion_rates.EUR).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener conversión', error });
  }
});

module.exports = router;