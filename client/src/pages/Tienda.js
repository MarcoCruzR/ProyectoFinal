import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Tienda = ({ carrito, setCarrito, stockTemporal, setStockTemporal }) => {
  const [cascos, setCascos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [conversiones, setConversiones] = useState({});
  const [mensajeCarrito, setMensajeCarrito] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const limite = 8;

  const obtenerCascos = async () => {
    const res = await axios.get(`http://localhost:3000/api/cascos?pagina=${pagina}&limite=${limite}`);
    setCascos(res.data.cascos);
    setTotal(res.data.total);
    res.data.cascos.forEach(c => {
      setStockTemporal(prev => {
        if (prev[c._id] === undefined) {
          return { ...prev, [c._id]: c.stock };
        }
        return prev;
      });
    });
    setStockTemporal(prev => {
      if (prev['especial'] === undefined) {
        return { ...prev, especial: 1 };
      }
      return prev;
    });
  };

  const obtenerConversion = async (precio, id) => {
    const res = await axios.get(`http://localhost:3000/api/moneda/${precio}`);
    setConversiones(prev => ({ ...prev, [id]: res.data }));
  };

  useEffect(() => {
    obtenerCascos();
  }, [pagina]);

  useEffect(() => {
    cascos.forEach(casco => obtenerConversion(casco.precio, casco._id));
    obtenerConversion(175000, 'especial');
  }, [cascos]);

  const eliminarCasco = async (id) => {
    await axios.delete(`http://localhost:3000/api/cascos/${id}`, {
      headers: { authorization: token }
    });
    obtenerCascos();
  };

  const agregarAlCarrito = (casco) => {
    const stockActual = stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock;
    if (stockActual <= 0) {
      setMensajeCarrito(`¡No hay stock disponible de ${casco.nombre}!`);
      setTimeout(() => setMensajeCarrito(''), 2500);
      return;
    }
    setCarrito([...carrito, casco]);
    setStockTemporal(prev => ({ ...prev, [casco._id]: stockActual - 1 }));
    setMensajeCarrito(`¡${casco.nombre} agregado al carrito!`);
    setTimeout(() => setMensajeCarrito(''), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const rol = localStorage.getItem('rol');
  const nombre = localStorage.getItem('nombre');

  return (
    <div className="tienda-container">
      <header className="tienda-header">
        <h1>TIENDA DE CASCOS HALO</h1>
        <p>Cascos del legendario universo de Halo</p>
        <div className="header-actions">
          <span>Bienvenido, {nombre}</span>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          {rol === 'admin' && <button onClick={() => navigate('/agregar')}>Agregar Casco</button>}
          {rol !== 'admin' && (
            <button onClick={() => navigate('/carrito')}>
              Ver Carrito ({carrito.length})
            </button>
          )}
        </div>
      </header>

      {mensajeCarrito && (
        <div className={mensajeCarrito.includes('No hay') ? 'mensaje-error' : 'mensaje-carrito'}>
          {mensajeCarrito}
        </div>
      )}

      <div className="cascos-grid">
        {cascos.map((casco) => (
          <div key={casco._id} className="casco-card">
            <img src={casco.imagen} alt={casco.nombre} />
            <h3>{casco.nombre}</h3>
            <p>{casco.descripcion}</p>
            <p className="precio">${casco.precio.toLocaleString()} MXN</p>
            {conversiones[casco._id] && (
              <div className="conversiones">
                <p>USD: ${conversiones[casco._id].USD}</p>
                <p>EUR: €{conversiones[casco._id].EUR}</p>
              </div>
            )}
            <p>Stock disponible: {stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock}</p>
            {rol === 'admin' ? (
              <div className="btn-actions">
                <button className="btn-editar" onClick={() => navigate(`/editar/${casco._id}`)}>EDITAR</button>
                <button className="btn-eliminar" onClick={() => eliminarCasco(casco._id)}>ELIMINAR</button>
              </div>
            ) : (
              <button
                className="btn-carrito"
                onClick={() => agregarAlCarrito(casco)}
                disabled={(stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock) <= 0}
                style={{
                  opacity: (stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock) <= 0 ? 0.3 : 1,
                  cursor: (stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock) <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {(stockTemporal[casco._id] !== undefined ? stockTemporal[casco._id] : casco.stock) <= 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="paginacion">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
        <span>Página {pagina}</span>
        <button disabled={pagina * limite >= total} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
      </div>

      <div className="especial-container">
        <h2 className="especial-titulo">ESPECIAL</h2>
        <div className="especial-card">
          <img src="https://i.imgur.com/i5noOCm.jpeg" alt="Armadura Completa" />
          <h3>ARMADURA COMPLETA</h3>
          <p>Spartan 3 [Traje completo] | Casco: Granadero UA/FC | Visor: Negro | Hombro Izquierdo: Francotirador | Hombro Derecho: MJOLNIR Mk. V | Pecho: Táctica/Patrulla (R) | Muñeca: UA/BRAZAL | Utilidad: Prederteminada | Rodilleras: Granadero | Efecto de armadura: Eterna | Recubrimiento: Blanco Estándar con detalles Verdes</p>
          <p className="precio">$175,000 MXN</p>
          {conversiones['especial'] && (
            <div className="conversiones">
              <p>USD: ${conversiones['especial'].USD}</p>
              <p>EUR: €{conversiones['especial'].EUR}</p>
            </div>
          )}
          <p>Stock disponible: {stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1}</p>
          {rol !== 'admin' && (
            <button
              className="btn-carrito"
              onClick={() => {
                const stockActual = stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1;
                if (stockActual <= 0) {
                  setMensajeCarrito('¡No hay stock disponible de Armadura Completa!');
                  setTimeout(() => setMensajeCarrito(''), 2500);
                  return;
                }
                setCarrito([...carrito, { nombre: 'Armadura Completa', descripcion: 'Spartan 3 [Traje completo]', precio: 175000 }]);
                setStockTemporal(prev => ({ ...prev, especial: stockActual - 1 }));
                setMensajeCarrito('¡Armadura Completa agregada al carrito!');
                setTimeout(() => setMensajeCarrito(''), 2500);
              }}
              disabled={(stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1) <= 0}
              style={{
                opacity: (stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1) <= 0 ? 0.3 : 1,
                cursor: (stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1) <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {(stockTemporal['especial'] !== undefined ? stockTemporal['especial'] : 1) <= 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tienda;