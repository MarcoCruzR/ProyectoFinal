const express = require('express');
const router = express.Router();
const cascoController = require('../controllers/cascoController');
const { verificarToken, soloAdmin } = require('../middleware/auth');
const { validarCasco } = require('../middleware/validacion');

router.get('/', cascoController.obtenerCascos);
router.get('/:id', cascoController.obtenerCasco);
router.post('/', verificarToken, soloAdmin, validarCasco, cascoController.crearCasco);
router.put('/:id', verificarToken, soloAdmin, validarCasco, cascoController.actualizarCasco);
router.delete('/:id', verificarToken, soloAdmin, cascoController.eliminarCasco);

module.exports = router;