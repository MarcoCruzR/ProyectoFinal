const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const cascoRoutes = require('./routes/cascoRoutes');
const monedaRoutes = require('./routes/monedaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4,
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log('Error de conexión:', err));

app.use('/api/auth', authRoutes);
app.use('/api/cascos', cascoRoutes);
app.use('/api/moneda', monedaRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});