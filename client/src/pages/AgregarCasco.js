import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const AgregarCasco = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: ''
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/cascos`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/tienda');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="agregar-container">
      <h2>Agregar Casco</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" onChange={handleChange} required />
        <input name="precio" type="number" placeholder="Precio" onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required />
        <input name="imagen" placeholder="URL de imagen" onChange={handleChange} required />
        <button type="submit">Agregar</button>
        <button type="button" onClick={() => navigate('/tienda')}>Cancelar</button>
      </form>
    </div>
  );
};

export default AgregarCasco;