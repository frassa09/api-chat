import { createAiSchema } from "../database/schemas/Ai.schema";

const urlIa = process.env.API_AI_URL;

export const aiService = {
  generate: async (prompt, model) => {
    const jsonBody = JSON.stringify({
      model,
      prompt,
      stream: false,
    });

    

    try {
      
      const result = createAiSchema.safeParse(jsonBody)

      if(!result.success){
        throw new Error('Erro na formatação da requisição')
      }
      const response = await fetch(`${urlIa}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
      });

      if (response.ok) return response;
    } catch (err) {
      console.log(err.message);

      return err;
    }
  },
};
