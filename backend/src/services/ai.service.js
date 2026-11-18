import { createAiSchema } from "../database/schemas/Ai.schema.js";

const urlIa = process.env.API_AI_URL;

export class AiServiceError extends Error {}

export const aiService = {
  generate: async (prompt, model) => {
    const result = createAiSchema.safeParse({
      model,
      prompt,
      stream: false,
    });

    if (!result.success) {
      throw new AiServiceError("Erro na formatação da requisição");
    }

    let response;
    try {
      response = await fetch(`${urlIa}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });
    } catch (err) {
      throw new AiServiceError(`Falha ao conectar com a IA: ${err.message}`);
    }

    if (!response.ok) {
      throw new AiServiceError(`IA respondeu HTTP ${response.status}`);
    }

    return response.json();
  },
};
