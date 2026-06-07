import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const resposta = await api.post('/autenticacao', { email, senha });
        const token = resposta.data.token;
        const dadosUsuario = jwtDecode(token);
        login(token, dadosUsuario);
        navigate('/dashboard');
    } catch (erro) {
        setErro('Email ou senha inválidos');
    }
};

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p>{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;