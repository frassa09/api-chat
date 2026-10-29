import { aiService } from "../services/ai.service.js";
import { messageController } from "./Message.controller.js";
import { sessionController } from "./Session.controller.js";

export const aiController = {
  generate: async (req, res) => {},
  initializeSessionAndGenerate: async (req, res) => {
    const userId = req.userId;
    const { firstMessage, model } = req.body;

    try {
      const responseSession = await sessionController.registerSessionOnDb(
        userId,
        firstMessage,
      );
      const responseMessageUser = await messageController.registerMessageOnDb(
        responseSession.dataValues.id,
        "user",
        firstMessage,
      );

      const responseAi = await aiService.generate(firstMessage, model);
      const data = await responseAi.json();

      const responserMessageAi = await messageController.registerMessageOnDb(
        responseSession.dataValues.id,
        "ia",
        data.response,
      );

      console.log(data);

      res.status(201).json({
        success: true,
        data: responseSession.dataValues,
        generatedContent: data,
        recordsOnDb: {
          messages: {
            user: responseMessageUser.dataValues,
            ai: responserMessageAi.dataValues,
          },
          session: responseSession.dataValues,
        },
      });
    } catch (err) {
      console.log(err.message);
      res.status(501).json({
        success: false,
        error: err.message,
      });
    }
  },
};
