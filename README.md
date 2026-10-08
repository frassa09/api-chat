# 🤖 Análise SenAI - Plataforma de Chat com IA Local

> Interface de chat multi-modelo integrada a provedores locais de Inteligência Artificial (Ollama/LocalAI) com gerenciamento de sessões e persistência de dados.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades (Requisitos)](#-funcionalidades-requisitos)
- [🚫 Restrições do Sistema](#-restrições-do-sistema)
- [🛠️ Arquitetura e Tecnologia](#️-arquitetura-e-tecnologia)
- [🗄️ Modelagem do Banco de Dados](#️-modelagem-do-banco-de-dados)
- [⚙️ Como Executar o Projeto](#️-como-executar-o-projeto)

---

## 💻 Sobre o Projeto

Este projeto consiste em uma plataforma de chat web estruturada sob a análise **SenAI**, projetada para operar com modelos de linguagem (LLMs) locais. O sistema funciona como um orquestrador de conversas seguro, permitindo que os usuários autenticados transitem entre diferentes modelos de inteligência artificial de forma isolada e persistente.

---

## ✨ Funcionalidades (Requisitos)

O sistema foi concebido com base nas seguintes especificações de requisitos funcionais:

*   **RF01 – Autenticação de Conta (Alta):** Cadastro, login e logout de usuários utilizando e-mail e senha. Rotas de chat protegidas por validação de token (retorna erro `401` caso não autenticado).
*   **RF02 – Sessões de Chat (Média):** Criação de múltiplas sessões independentes de conversa, com geração automática de títulos com base na primeira mensagem do usuário.
*   **RF03 – Histórico de Mensagens (Baixa):** Salvamento automático de todas as interações (prompts do usuário e respostas da IA) vinculadas à sessão ativa no banco de dados.
*   **RF04 – Configuração do Modelo de IA (Alta):** Menu suspenso na interface que permite selecionar o modelo desejado (ex: Llama 3, Mistral) antes de iniciar uma nova conversa.
*   **RF05 – Listagem Cronológica (Baixa):** Menu lateral que exibe os chats anteriores do usuário logado, ordenados pela data de atualização mais recente.

---

## 🚫 Restrições do Sistema

Para garantir a estabilidade e o escopo do ecossistema local, aplicam-se as seguintes regras de negócio:

*   **Entrada de Dados:** O sistema opera estritamente com dados em formato de texto. O anexo ou upload de arquivos por parte do usuário é bloqueado.
*   **Saída da IA:** A Inteligência Artificial está impedida de criar, gerar ou enviar arquivos de qualquer tipo para download do usuário.
*   **Integridade:** Mensagens já enviadas na sessão não podem ser editadas ou alteradas posteriormente.
*   **Fluxo de Resposta:** Uma vez iniciado o processamento ou a geração de texto pela IA, o usuário não pode interromper o raciocínio até que a mensagem seja totalmente concluída.

---

## 🛠️ Arquitetura e Tecnologia

*   **Banco de Dados:** PostgreSQL (com criptografia nativa e geração de UUIDs).
*   **Engine de IA Base:** Suporte a tags locais mapeadas para servidores locais como [Ollama](https://ollama.com) ou [LocalAI](https://localai.io).
*   **Segurança:** Criptografia de senhas via Hash (`bcrypt` ou `argon2`).

---

## 🗄️ Modelagem do Banco de Dados

O banco de dados PostgreSQL está estruturado em 4 tabelas fundamentais correlacionadas:

### 1. `usuarios`
Armazena as credenciais e dados cadastrais dos usuários do sistema.
*   `id` (UUID, PK)
*   `nome` (VARCHAR)
*   `email` (VARCHAR, Unique)
*   `senha_hash` (VARCHAR)
*   `criado_em` (TIMESTAMPTZ)

### 2. `modelos_ia`
Registra os modelos LLM disponíveis e suas respectivas tags de chamada local.
*   `id` (UUID, PK)
*   `nome` (VARCHAR) - Nome de exibição na UI (ex: "Llama 3").
*   `tag_local` (VARCHAR) - Tag interna do Ollama (ex: `llama3:8b`).
*   `ativo` (BOOLEAN) - Define se o modelo aparece listado para uso.

### 3. `chats`
Gerencia as sessões de conversa individuais criadas por cada usuário.
*   `id` (UUID, PK)
*   `usuario_id` (UUID, FK -> `usuarios.id` com `ON DELETE CASCADE`)
*   `modelo_id` (UUID, FK -> `modelos_ia.id` com `ON DELETE RESTRICT`)
*   `titulo` (VARCHAR)
*   `criado_em` / `atualizado_em` (TIMESTAMPTZ)

### 4. `mensagens`
Registra o histórico textual de prompts e respostas de cada sessão.
*   `id` (UUID, PK)
*   `chat_id` (UUID, FK -> `chats.id` com `ON DELETE CASCADE`)
*   `papel` (ENUM `papel_tipo`: `user`, `assistant`, `system`)
*   `conteudo` (TEXT)
*   `criado_em` (TIMESTAMPTZ)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
*   PostgreSQL instalado e rodando localmente.
*   Instância local do Ollama ou LocalAI configurada com os modelos desejados baixados.

### Configuração Inicial

```
# 1. Clone o repositório
$ git clone https://github.com
$ cd analise-senai

# 2. Configuração do Banco de Dados (PostgreSQL)
# Certifique-se de executar as migrations para criar as tabelas e habilitar as extensões de UUID.
```

*(Nota: Adicione aqui os comandos específicos do framework que você escolheu para o Backend/Frontend, como `npm install` ou `pip install`, para complementar o seu fluxo real de desenvolvimento).*
