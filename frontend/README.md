# ChatSpace — Sidebar e histórico de chats

Projeto em **React + JavaScript (JSX) + Tailwind CSS v4** com **API fake em JavaScript**, sem TypeScript. O backend simulado roda junto ao Vite.

## Como executar no VS Code

Requer Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Abra o endereço fornecido pelo Vite, normalmente **http://localhost:5173**.

Para gerar uma versão compilada:

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Sidebar** responsiva com busca de chats, agrupamento por datas e títulos carregados por API.
- **Nova conversa** limpa as mensagens e o rascunho e reinicia a escolha de modelo.
- **Clique em um chat** busca o histórico pelo ID e mostra mensagens de usuário e assistente.
- **Envio de mensagens** cria uma conversa ou continua uma já existente.
- **Persistência local** no arquivo `server/database.json`, gerado automaticamente na primeira execução da API fake.
- A escolha de modelo (`Equilibrado`, `Rápido`, `Analítico`) é demonstrativa e afeta somente o texto simulado.

## Tailwind CSS

Este projeto usa a integração oficial de **Tailwind v4 com Vite**:

- `tailwindcss` e `@tailwindcss/vite` declarados no `package.json`;
- `tailwindcss()` adicionado ao `vite.config.js`;
- `src/index.css` contém somente `@import "tailwindcss";`;
- **Todo o layout e o visual estão em classes Tailwind dentro dos componentes JSX**.

Não há arquivos `.ts`, `.tsx`, `tailwind.config.js` ou estilos CSS personalizados de componentes. Na v4, o arquivo de configuração JS do Tailwind não é necessário para este projeto.

## API fake

Requisições HTTP feitas com `fetch()` em `src/services/chatApi.js`:

| Método | Endpoint | O que faz |
| --- | --- | --- |
| `GET` | `/api/conversations` | Lista títulos, modelo, data e resumo (sem mensagens) |
| `GET` | `/api/conversations/:id` | Recupera o histórico completo |
| `POST` | `/api/conversations` | Cria conversa a partir de `{ "model": "equilibrado", "message": "Olá" }` |
| `POST` | `/api/conversations/:id/messages` | Salva nova mensagem com `{ "message": "Tudo bem?" }` |

API implementada em `server/mock-api.js` e registrada como middleware no Vite. Funciona com `npm run dev` e `npm run preview`, **mas um deploy estático isolado não inclui o servidor de API**. As respostas são simuladas e não chamam nenhum modelo de IA.

## Estrutura do projeto

```text
painel-historico-chats-tailwind/
├── index.html
├── package.json
├── vite.config.js          # React + Tailwind + API fake
├── server/
│   └── mock-api.js         # Rotas REST e dados em JSON
└── src/
    ├── main.jsx
    ├── index.css          # @import "tailwindcss"
    ├── App.jsx            # Estados de chats, seleção e novo chat
    ├── components/
    │   ├── Sidebar.jsx    # Histórico + busca + nova conversa
    │   ├── ChatPanel.jsx  # Histórico + seletor de modelo + envio
    │   └── Icons.jsx
    └── services/
        └── chatApi.js      # Chamadas fetch à API
```

## Reiniciar conversas de exemplo

Pare o servidor e apague `server/database.json` (se existir). Ele será criado novamente com três exemplos.
