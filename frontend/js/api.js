// Wrapper de fetch com token JWT automático e tratamento de erros
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    logout();
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.mensagem || `Erro ${res.status}`);
  }

  return data;
}

function mostrarErro(elementoId, mensagem) {
  const el = document.getElementById(elementoId);
  if (!el) return;
  el.textContent = mensagem;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function mostrarSucesso(elementoId, mensagem) {
  const el = document.getElementById(elementoId);
  if (!el) return;
  el.textContent = mensagem;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function statusLabel(status) {
  const labels = {
    pendente:    { text: 'Pendente',    cls: 'badge-pendente' },
    em_analise:  { text: 'Em Análise',  cls: 'badge-analise' },
    aprovado:    { text: 'Aprovado',    cls: 'badge-aprovado' },
    negado:      { text: 'Negado',      cls: 'badge-negado' },
  };
  return labels[status] || { text: status, cls: '' };
}
