import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Carrito = ({ carrito, setCarrito, stockTemporal, setStockTemporal }) => {
  const navigate = useNavigate();
  const [comprado, setComprado] = useState(false);

  const total = carrito.reduce((acc, casco) => acc + casco.precio, 0);

  const handleComprar = () => {
    setComprado(true);
    setTimeout(() => {
      setCarrito([]);
      navigate('/tienda');
    }, 3000);
  };

  const eliminarDelCarrito = (index) => {
    const casco = carrito[index];
    const id = casco._id || 'especial';
    setStockTemporal(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  return (
    <div className="agregar-container">
      <h2>Carrito</h2>
      <div className="carrito-lista">
        {carrito.length === 0 && !comprado && (
          <p style={{ color: '#ffffff88', letterSpacing: '2px' }}>Tu carrito está vacío</p>
        )}
        {comprado ? (
          <p className="compra-exitosa">¡Compra realizada con éxito! 🎉</p>
        ) : (
          <>
            {carrito.map((casco, index) => (
              <div key={index} className="carrito-item">
                <h3>{casco.nombre}</h3>
                <p>{casco.descripcion}</p>
                <p className="precio">${casco.precio.toLocaleString()} MXN</p>
                <button className="btn-eliminar-carrito" onClick={() => eliminarDelCarrito(index)}>ELIMINAR</button>
              </div>
            ))}
            {carrito.length > 0 && (
              <div className="carrito-total">
                <p>TOTAL: <span className="precio">${total.toLocaleString()} MXN</span></p>
                <button onClick={handleComprar}>Comprar</button>
              </div>
            )}
          </>
        )}
        {!comprado && (
          <button type="button" onClick={() => navigate('/tienda')}>
            Volver a la tienda
          </button>
        )}
      </div>
    </div>
  );
};

export default Carrito;