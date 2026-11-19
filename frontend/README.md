# Frontend — ChatSpace

React + Vite + Tailwind CSS v4. Consome o backend em `../backend`.

## Rodando

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

O backend e a IA local (`../docker`) precisam estar rodando.

## Estrutura

```
src/
├── App.jsx               # Estado da tela de chat (lista, conversa ativa, envio)
├── components/
│   ├── ChatPanel.jsx     # Mensagens e campo de envio
│   ├── Sidebar.jsx       # Histórico de conversas
│   └── Icons.jsx
├── pages/
│   ├── Login.jsx         # Layout pronto, ainda sem integração
│   └── Cadastro.jsx      # Layout pronto, ainda sem integração
└── services/
    └── chatApi.js        # Todas as chamadas ao backend + token JWT
```

## Endpoints usados (`services/chatApi.js`)

| Função | Rota |
|---|---|
| `register` | `POST /user` |
| `login` | `POST /user/login` |
| `listConversations` | `GET /sessions` |
| `getConversation` | `GET /sessions/:id` |
| `createConversation` | `POST /ai/new-session` |
| `sendMessage` | `POST /ai/sessions/:id/messages` |
| `generateTitle` | `POST /ai/sessions/:id/title` |

Todas, exceto `register` e `login`, exigem `Authorization: Bearer <token>` (enviado automaticamente a partir do `localStorage`).
