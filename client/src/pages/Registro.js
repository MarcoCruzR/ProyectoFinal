import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Registro = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    codigoAdmin: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [verCodigo, setVerCodigo] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/registrar`, form);
      setMensaje(res.data.mensaje);
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar');
      setMensaje('');
    }
  };

  return (
    <div className="agregar-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <div className="password-wrapper">
          <input
            name="password"
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setVerPassword(!verPassword)}>
            {verPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <div className="password-wrapper">
          <input
            name="codigoAdmin"
            type={verCodigo ? 'text' : 'password'}
            placeholder="Código admin (opcional)"
            onChange={handleChange}
          />
          <button type="button" onClick={() => setVerCodigo(!verCodigo)}>
            {verCodigo ? '🙈' : '👁️'}
          </button>
        </div>
        {mensaje && <p style={{ color: '#00ff88', textAlign: 'center', letterSpacing: '1px' }}>{mensaje}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarse</button>
        <button type="button" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
};

export default Registro;