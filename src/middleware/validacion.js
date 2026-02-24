const validarCasco = (req, res, next) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  if (!descripcion || descripcion.trim() === '') {
    return res.status(400).json({ error: 'La descripcion es obligatoria' });
  }

  if (!precio || isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
  }

  if (stock === undefined || isNaN(stock) || Number(stock) < 0) {
    return res.status(400).json({ error: 'El stock debe ser un número mayor o igual a 0' });
  }

  if (!imagen || imagen.trim() === '') {
    return res.status(400).json({ error: 'La imagen es obligatoria' });
  }

  next();
};

const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'El email no es válido' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  next();
};

module.exports = { validarCasco, validarRegistro };