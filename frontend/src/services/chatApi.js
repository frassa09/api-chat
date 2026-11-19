const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'token';

// ---- Token ---------------------------------------------------------------
// TODO: salvar o token aqui depois do login (setToken) e limpar no logout.

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class UnauthorizedError extends Error {}

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearToken();
    throw new UnauthorizedError(payload.message || 'Sessão expirada, faça login novamente');
  }
  if (!response.ok) {
    throw new Error(payload.error || payload.message || `Falha na API: HTTP ${response.status}`);
  }
  return payload;
}

// ---- Usuário ---------------------------------------------------------------

// POST /user
export const register = (name, email, password) => request('/user', {
  method: 'POST',
  body: JSON.stringify({ name, email, password }),
});

// POST /user/login -> { token }
export const login = (email, password) => request('/user/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// ---- Conversas --------------------------------------------------------------

// GET /sessions -> [{ id, title, createdAt, updatedAt }]
export const listConversations = async () => {
  const { data } = await request('/sessions');
  return data;
};

// GET /sessions/:id -> { id, title, updatedAt, messages: [{ id, role, content, createdAt }] }
export const getConversation = async (id) => {
  const { data } = await request(`/sessions/${encodeURIComponent(id)}`);
  const { Messages, ...session } = data;
  return { ...session, messages: Messages ?? [] };
};

// POST /ai/new-session -> cria a sessão com a primeira mensagem e a resposta da IA.
export const createConversation = async (message) => {
  const { data } = await request('/ai/new-session', {
    method: 'POST',
    body: JSON.stringify({ firstMessage: message }),
  });
  return getConversation(data.id);
};

// POST /ai/sessions/:id/messages -> { userMessage, aiMessage }
export const sendMessage = async (id, message) => {
  const { data } = await request(`/ai/sessions/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return [data.userMessage, data.aiMessage];
};

// POST /ai/sessions/:id/title -> gera com a IA um título de até 100 caracteres.
export const generateTitle = async (id) => {
  const { data } = await request(`/ai/sessions/${encodeURIComponent(id)}/title`, {
    method: 'POST',
  });
  return data.title;
};
