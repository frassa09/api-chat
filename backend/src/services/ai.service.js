import { chatAiSchema, createAiSchema } from "../database/schemas/Ai.schema.js";

const urlIa = process.env.API_AI_URL;

// Modelo baixado no docker/Dockerfile. Por enquanto fixo.
export const AI_MODEL = "qwen2.5-coder:1.5b";

export const TITLE_MAX_LENGTH = 100;

export class AiServiceError extends Error {}

async function callAi(path, body) {
  let response;
  try {
    response = await fetch(`${urlIa}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new AiServiceError(`Falha ao conectar com a IA: ${err.message}`);
  }

  if (!response.ok) {
    throw new AiServiceError(`IA respondeu HTTP ${response.status}`);
  }

  return response.json();
}

export const truncateTitle = (text) => {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > TITLE_MAX_LENGTH
    ? `${clean.slice(0, TITLE_MAX_LENGTH - 3)}...`
    : clean;
};

export const aiService = {
  // Prompt único, sem histórico. Retorna o JSON do Ollama ({ response, ... }).
  generate: async (prompt) => {
    const result = createAiSchema.safeParse({
      model: AI_MODEL,
      prompt,
      stream: false,
    });

    if (!result.success) {
      throw new AiServiceError("Erro na formatação da requisição");
    }

    return callAi("/api/generate", result.data);
  },

  // Conversa com histórico. messages: [{ role: 'user' | 'assistant', content }].
  // Retorna o texto da resposta.
  chat: async (messages) => {
    const result = chatAiSchema.safeParse({
      model: AI_MODEL,
      messages,
      stream: false,
    });

    if (!result.success) {
      throw new AiServiceError("Erro na formatação da requisição");
    }

    console.log(result.data)

    const data = await callAi("/api/chat", result.data);
    return data.message?.content ?? "";
  },

  generateTitle: async (firstMessage) => {
    const prompt =
      `Crie um título curto (no máximo ${TITLE_MAX_LENGTH} caracteres), em português, ` +
      `para uma conversa que começa com a mensagem abaixo. ` +
      `Responda somente com o título, sem aspas e sem explicações.\n\n` +
      `Mensagem: ${firstMessage}`;

    const data = await aiService.generate(prompt);

    const firstLine = (data.response ?? "").trim().split("\n")[0];
    const title = truncateTitle(firstLine.replace(/^["'*#\s]+|["'*\s]+$/g, ""));

    return title || truncateTitle(firstMessage);
  },
};
