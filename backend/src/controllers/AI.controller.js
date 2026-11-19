import { Message } from "../models/Message.model.js";
import { messageBodySchema } from "../database/schemas/Ai.schema.js";
import { aiService, AiServiceError } from "../services/ai.service.js";
import { messageController } from "./Message.controller.js";
import { findUserSession, sessionController } from "./Session.controller.js";

const toOllamaRole = (role) => (role === "ia" ? "assistant" : "user");

const handleError = (res, err, fallback) => {
  console.log(err.message);

  const isAiError = err instanceof AiServiceError;
  res.status(isAiError ? 502 : 500).json({
    success: false,
    error: isAiError ? err.message : fallback,
  });
};

export const aiController = {
  // POST /ai/sessions/:id/messages  { message }
  generate: async (req, res) => {
    const result = messageBodySchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, error: result.error.issues[0].message });
    }
    const content = result.data.message;

    try {
      const session = await findUserSession(req.params.id, req.userId);
      if (!session) {
        return res
          .status(404)
          .json({ success: false, error: "Sessão não encontrada" });
      }

      const history = await Message.findAll({
        where: { sessionId: session.id },
        attributes: ["role", "content"],
        order: [["createdAt", "ASC"]],
      });

      // Chama a IA primeiro: só grava no banco se ela responder.
      const answer = await aiService.chat([
        ...history.map((m) => ({ role: toOllamaRole(m.role), content: m.content })),
        { role: "user", content },
      ]);

      const userMessage = await messageController.registerMessageOnDb(
        session.id,
        "user",
        content,
      );
      const aiMessage = await messageController.registerMessageOnDb(
        session.id,
        "ia",
        answer,
      );

      // Atualiza o updatedAt para a sessão subir na lista.
      session.changed("updatedAt", true);
      await session.save();

      res.status(201).json({
        success: true,
        data: { userMessage, aiMessage },
      });
    } catch (err) {
      handleError(res, err, "Erro interno ao enviar mensagem");
    }
  },

  // POST /ai/new-session  { firstMessage }
  initializeSessionAndGenerate: async (req, res) => {
    const userId = req.userId;
    const result = messageBodySchema.safeParse({ message: req.body.firstMessage });
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, error: result.error.issues[0].message });
    }
    const firstMessage = result.data.message;

    try {
      // Chama a IA primeiro: só grava no banco se ela responder.
      const answer = await aiService.chat([{ role: "user", content: firstMessage }]);

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
        answer,
      );

      res.status(201).json({
        success: true,
        data: responseSession.dataValues,
        generatedContent: { response: answer },
        recordsOnDb: {
          messages: {
            user: responseMessageUser.dataValues,
            ai: responseMessageAi.dataValues,
          },
          session: responseSession.dataValues,
        },
      });
    } catch (err) {
      handleError(res, err, "Erro interno ao iniciar a sessão");
    }
  },

  // POST /ai/sessions/:id/title
  // Gera com a IA um título de até 100 caracteres a partir da primeira mensagem e salva na sessão.
  generateTitle: async (req, res) => {
    try {
      const session = await findUserSession(req.params.id, req.userId);
      if (!session) {
        return res
          .status(404)
          .json({ success: false, error: "Sessão não encontrada" });
      }

      const firstMessage = await Message.findOne({
        where: { sessionId: session.id, role: "user" },
        order: [["createdAt", "ASC"]],
      });
      if (!firstMessage) {
        return res
          .status(400)
          .json({ success: false, error: "Sessão sem mensagens" });
      }

      const title = await aiService.generateTitle(firstMessage.content);
      await session.update({ title });

      res.status(200).json({ success: true, data: { id: session.id, title } });
    } catch (err) {
      handleError(res, err, "Erro interno ao gerar título");
    }
  },
};
