import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Tienda from './pages/Tienda';
import AgregarCasco from './pages/AgregarCasco';
import EditarCasco from './pages/EditarCasco';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';

const App = () => {
  const [carrito, setCarrito] = useState([]);
  const [stockTemporal, setStockTemporal] = useState({});

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tienda" element={<Tienda carrito={carrito} setCarrito={setCarrito} stockTemporal={stockTemporal} setStockTemporal={setStockTemporal} />} />
          <Route path="/agregar" element={<AgregarCasco />} />
          <Route path="/editar/:id" element={<EditarCasco setStockTemporal={setStockTemporal} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} stockTemporal={stockTemporal} setStockTemporal={setStockTemporal} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;