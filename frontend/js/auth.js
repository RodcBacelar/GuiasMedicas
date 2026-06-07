// Decodifica payload do JWT sem biblioteca externa
function decodeJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  const token = getToken();
  if (!token) return null;
  return decodeJWT(token);
}

function salvarToken(token) {
  localStorage.setItem('token', token);
}

// Resolve o caminho correto independente de como o frontend está sendo servido
function paginaBase() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = paginaBase() + 'index.html';
}

// Redireciona para o dashboard correto conforme o tipo do usuário
function redirecionarPorTipo(tipo) {
  const destinos = {
    medico:   'dashboard-medico.html',
    paciente: 'dashboard-paciente.html',
    unidade:  'dashboard-unidade.html',
  };
  window.location.href = paginaBase() + (destinos[tipo] || 'index.html');
}

// Garante que a página só pode ser acessada por usuários logados do tipo certo
function exigirAuth(...tipos) {
  const usuario = getUsuario();
  if (!usuario) {
    window.location.href = paginaBase() + 'index.html';
    return null;
  }
  if (tipos.length > 0 && !tipos.includes(usuario.tipo)) {
    window.location.href = paginaBase() + 'index.html';
    return null;
  }
  return usuario;
}
