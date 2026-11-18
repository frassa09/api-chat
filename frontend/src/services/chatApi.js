const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Falha na API: HTTP ${response.status}`);
  }
  return payload;
}

// GET: carrega somente os dados necessários à sidebar.
export const listConversations = () => request('/conversations');

// GET: busca o histórico de mensagens da conversa selecionada.
export const getConversation = (id) => request(`/conversations/${encodeURIComponent(id)}`);

// POST: cria o chat após o envio da primeira mensagem.
export const createConversation = (model, message) => request('/conversations', {
  method: 'POST',
  body: JSON.stringify({ model, message }),
});

// POST: adiciona mensagem à conversa e recebe uma resposta simulada.
export const sendMessage = (id, message) => request(`/conversations/${encodeURIComponent(id)}/messages`, {
  method: 'POST',
  body: JSON.stringify({ message }),
});
