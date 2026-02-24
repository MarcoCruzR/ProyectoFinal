import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      login(res.data);
      navigate('/tienda');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-wrapper">
          <input type={verPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setVerPassword(!verPassword)}>
            {verPassword ? '👁️' : '👁️'}
          </button>
        </div>
        <button type="submit">Entrar</button>
        <button type="button" onClick={() => navigate('/registro')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
          Crear Cuenta
        </button>
      </form>
    </div>
  );
};

export default Login;