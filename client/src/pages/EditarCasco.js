import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditarCasco = ({ setStockTemporal }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: ''
  });
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const obtenerCasco = async () => {
      const res = await axios.get(`http://localhost:3000/api/cascos/${id}`);
      setForm(res.data);
    };
    obtenerCasco();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/cascos/${id}`, form, {
        headers: { authorization: token }
      });
      setStockTemporal(prev => {
        const nuevoStock = { ...prev };
        delete nuevoStock[id];
        return nuevoStock;
      });
      navigate('/tienda');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="agregar-container">
      <h2>Editar Casco</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} required />
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={() => navigate('/tienda')}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarCasco;