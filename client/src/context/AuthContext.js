import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (datos) => {
    setUsuario({ nombre: datos.nombre, rol: datos.rol });
    setToken(datos.token);
    localStorage.setItem('token', datos.token);
    localStorage.setItem('rol', datos.rol);
    localStorage.setItem('nombre', datos.nombre);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);