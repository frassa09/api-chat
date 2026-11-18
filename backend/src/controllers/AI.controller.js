import { aiService, AiServiceError } from "../services/ai.service.js";
import { messageController } from "./Message.controller.js";
import { sessionController } from "./Session.controller.js";

export const aiController = {
  generate: async (req, res) => {},
  initializeSessionAndGenerate: async (req, res) => {
    const userId = req.userId;
    const { firstMessage, model } = req.body;

    try {
      // Chama a IA primeiro: só grava no banco se ela responder.
      const data = await aiService.generate(firstMessage, model);

      const responseSession = await sessionController.registerSessionOnDb(
        userId,
        firstMessage,
      );
      const sessionId = responseSession.dataValues.id;

      const responseMessageUser = await messageController.registerMessageOnDb(
        sessionId,
        "user",
        firstMessage,
      );

      const responseMessageAi = await messageController.registerMessageOnDb(
        sessionId,
        "ia",
        data.response,
      );

      res.status(201).json({
        success: true,
        data: responseSession.dataValues,
        generatedContent: data,
        recordsOnDb: {
          messages: {
            user: responseMessageUser.dataValues,
            ai: responseMessageAi.dataValues,
          },
          session: responseSession.dataValues,
        },
      });
    } catch (err) {
      console.log(err.message);

      const isAiError = err instanceof AiServiceError;
      res.status(isAiError ? 502 : 500).json({
        success: false,
        error: isAiError ? err.message : "Erro interno ao iniciar a sessão",
      });
    }
  },
};
