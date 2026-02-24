const Casco = require('../models/casco');

const obtenerCascos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 8;
    const skip = (pagina - 1) * limite;

    const total = await Casco.countDocuments();
    const cascos = await Casco.find().skip(skip).limit(limite);

    res.json({ total, pagina, limite, cascos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cascos', error });
  }
};

const obtenerCasco = async (req, res) => {
  try {
    const casco = await Casco.findById(req.params.id);
    if (!casco) return res.status(404).json({ mensaje: 'Casco no encontrado' });
    res.json(casco);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener casco', error });
  }
};

const crearCasco = async (req, res) => {
  try {
    const body = {
      ...req.body,
      precio: Number(req.body.precio),
      stock: Number(req.body.stock)
    };
    const casco = new Casco(body);
    await casco.save();
    res.status(201).json({ mensaje: 'Casco creado exitosamente', casco });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear casco', error });
  }
};

const actualizarCasco = async (req, res) => {
  try {
    const body = {
      ...req.body,
      precio: Number(req.body.precio),
      stock: Number(req.body.stock)
    };
    const casco = await Casco.findByIdAndUpdate(req.params.id, body, { returnDocument: 'after' });
    if (!casco) return res.status(404).json({ mensaje: 'Casco no encontrado' });
    res.json({ mensaje: 'Casco actualizado exitosamente', casco });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar casco', error });
  }
};

const eliminarCasco = async (req, res) => {
  try {
    const casco = await Casco.findByIdAndDelete(req.params.id);
    if (!casco) return res.status(404).json({ mensaje: 'Casco no encontrado' });
    res.json({ mensaje: 'Casco eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar casco', error });
  }
};

module.exports = { obtenerCascos, obtenerCasco, crearCasco, actualizarCasco, eliminarCasco };