import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RotaProtegida;