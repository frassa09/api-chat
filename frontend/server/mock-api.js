import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DB_FILE = fileURLToPath(new URL('./database.json', import.meta.url));
const MODEL_IDS = ['equilibrado', 'rapido', 'analitico'];

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function initialData() {
  return [
    {
      id: 'exemplo-react',
      title: 'Ideias para um projeto React',
      model: 'equilibrado',
      updatedAt: hoursAgo(2),
      messages: [
        { id: 'r-1', role: 'user', content: 'Como organizar os componentes de um projeto React?', createdAt: hoursAgo(2.1) },
        { id: 'r-2', role: 'assistant', content: 'Uma boa estrutura separa interface, serviços e estilos. Por exemplo: src/components, src/services e src/index.css (Tailwind CSS). Esta resposta faz parte do histórico de demonstração.', createdAt: hoursAgo(2) },
      ],
    },
    {
      id: 'exemplo-api',
      title: 'Entendendo as APIs REST',
      model: 'analitico',
      updatedAt: hoursAgo(28),
      messages: [
        { id: 'a-1', role: 'user', content: 'O que é uma API REST?', createdAt: hoursAgo(28.1) },
        { id: 'a-2', role: 'assistant', content: 'É uma interface de comunicação baseada em recursos, URLs e métodos HTTP, como GET e POST. Aqui usamos rotas REST simuladas para carregar e salvar conversas.', createdAt: hoursAgo(28) },
      ],
    },
    {
      id: 'exemplo-rotina',
      title: 'Planejamento da semana',
      model: 'rapido',
      updatedAt: hoursAgo(95),
      messages: [
        { id: 's-1', role: 'user', content: 'Me ajude a organizar as tarefas da semana.', createdAt: hoursAgo(95.1) },
        { id: 's-2', role: 'assistant', content: 'Comece anotando prioridades, prazos e tempo estimado. Depois distribua as atividades pela semana e reserve espaço para imprevistos.', createdAt: hoursAgo(95) },
      ],
    },
  ];
}

function readDatabase() {
  if (!existsSync(DB_FILE)) {
    const initial = initialData();
    writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(readFileSync(DB_FILE, 'utf8'));
}

function saveDatabase(data) {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function respond(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let text = '';
    req.on('data', (chunk) => {
      text += chunk;
      if (text.length > 100_000) reject(new Error('Requisição muito grande.'));
    });
    req.on('end', () => {
      try {
        resolve(text ? JSON.parse(text) : {});
      } catch {
        reject(new Error('JSON inválido.'));
      }
    });
    req.on('error', reject);
  });
}

function summarize(chat) {
  const { messages, ...metadata } = chat;
  return { ...metadata, preview: messages.at(-1)?.content ?? '' };
}

function makeReply(message, model) {
  const normalized = message.toLocaleLowerCase('pt-BR');
  const opening = model === 'analitico'
    ? 'Vamos analisar sua mensagem. '
    : model === 'rapido'
      ? 'Resposta rápida: '
      : 'Claro! ';

  if (normalized.includes('react')) {
    return opening + 'No React, você pode dividir a interface em componentes reutilizáveis e manter a comunicação com a API em um módulo de serviços. Esta resposta foi gerada pela API fake.';
  }
  if (normalized.includes('api') || normalized.includes('histórico')) {
    return opening + 'Neste projeto, o frontend consulta GET /api/conversations e GET /api/conversations/:id para obter lista e histórico. Esta é uma resposta simulada, não uma IA real.';
  }
  return opening + `Sua mensagem foi recebida: “${message.slice(0, 190)}${message.length > 190 ? '…' : ''}”. O backend fictício salvou esta conversa e retornou uma resposta de demonstração.`;
}

function addUserAndAssistant(chat, message) {
  const timestamp = new Date().toISOString();
  chat.messages.push({ id: randomUUID(), role: 'user', content: message, createdAt: timestamp });
  chat.messages.push({ id: randomUUID(), role: 'assistant', content: makeReply(message, chat.model), createdAt: new Date().toISOString() });
  chat.updatedAt = new Date().toISOString();
}

export function createMockApi() {
  return async (req, res, next) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'conversations') return next();

    // Pequena latência para testar loading e navegação de verdade.
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const db = readDatabase();
      const method = req.method;

      if (segments.length === 1 && method === 'GET') {
        return respond(res, 200, db.map(summarize).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      }

      if (segments.length === 1 && method === 'POST') {
        const body = await parseBody(req);
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const model = body.model;
        if (!MODEL_IDS.includes(model) || !message || message.length > 5000) {
          return respond(res, 400, { error: 'Informe um modelo válido e uma mensagem de até 5.000 caracteres.' });
        }
        const chat = {
          id: randomUUID(),
          title: message.slice(0, 38) + (message.length > 38 ? '…' : ''),
          model,
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        addUserAndAssistant(chat, message);
        db.unshift(chat);
        saveDatabase(db);
        return respond(res, 201, chat);
      }

      if (segments.length >= 2) {
        const chat = db.find((item) => item.id === segments[1]);
        if (!chat) return respond(res, 404, { error: 'Conversa não encontrada.' });

        if (segments.length === 2 && method === 'GET') return respond(res, 200, chat);

        if (segments.length === 3 && segments[2] === 'messages' && method === 'POST') {
          const body = await parseBody(req);
          const message = typeof body.message === 'string' ? body.message.trim() : '';
          if (!message || message.length > 5000) {
            return respond(res, 400, { error: 'A mensagem deve ter entre 1 e 5.000 caracteres.' });
          }
          addUserAndAssistant(chat, message);
          saveDatabase(db);
          return respond(res, 200, chat);
        }
      }

      return respond(res, 404, { error: 'Rota não encontrada.' });
    } catch (error) {
      return respond(res, 500, { error: error.message ?? 'Erro interno na API fake.' });
    }
  };
}
