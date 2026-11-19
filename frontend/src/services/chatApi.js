import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ---- Token ----

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

// Dados do usuário guardados no token: { userId, name, email, exp }
export function getUser() {
  const token = getToken();
  if (!token) return null;

  const user = jwtDecode(token);
  if (user.exp * 1000 < Date.now()) {
    clearToken();
    return null;
  }
  return user;
}

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

// Lê o JSON e lança erro (com o status) se a API recusar.
async function readResponse(response) {
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body.message || body.error || 'Erro na requisição');
    error.status = response.status;
    throw error;
  }
  return body;
}

// ---- Usuário ----

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });
  return readResponse(response);
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const body = await readResponse(response);
  setToken(body.token);
  return getUser();
}

// ---- Conversas ----

export async function listConversations() {
  const response = await fetch(`${API_URL}/sessions`, { headers: headers() });
  const body = await readResponse(response);
  return body.data;
}

export async function getConversation(id) {
  const response = await fetch(`${API_URL}/sessions/${id}`, { headers: headers() });
  const body = await readResponse(response);
  return { ...body.data, messages: body.data.Messages };
}

export async function createConversation(message) {
  const response = await fetch(`${API_URL}/ai/new-session`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ firstMessage: message }),
  });
  const body = await readResponse(response);
  return body.data; // sessão criada
}

export async function sendMessage(id, message) {
  const response = await fetch(`${API_URL}/ai/sessions/${id}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message }),
  });
  const body = await readResponse(response);
  return [body.data.userMessage, body.data.aiMessage];
}

export async function generateTitle(id) {
  const response = await fetch(`${API_URL}/ai/sessions/${id}/title`, {
    method: 'POST',
    headers: headers(),
  });
  const body = await readResponse(response);
  return body.data.title;
}
