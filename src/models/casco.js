const mongoose = require('mongoose');

const cascoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Casco', cascoSchema);