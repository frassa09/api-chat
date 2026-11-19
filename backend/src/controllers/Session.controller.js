import { Session } from "../models/Session.model.js";
import { Message } from "../models/Message.model.js";
import { truncateTitle } from "../services/ai.service.js";

// Busca uma sessão garantindo que pertence ao usuário. Retorna null se não existir.
export const findUserSession = (sessionId, userId) =>
  Session.findOne({ where: { id: sessionId, userId, status: "active" } });

export const sessionController = {
  registerSessionOnDb: async (userId, firstMessage) => {
    return Session.create({
      title: truncateTitle(firstMessage),
      status: "active",
      userId,
    });
  },

  // GET /sessions
  list: async (req, res) => {
    try {
      const sessions = await Session.findAll({
        where: { userId: req.userId, status: "active" },
        attributes: ["id", "title", "createdAt", "updatedAt"],
        order: [["updatedAt", "DESC"]],
      });

      res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, error: "Erro ao listar sessões" });
    }
  },

  // GET /sessions/:id
  getWithMessages: async (req, res) => {
    try {
      const session = await Session.findOne({
        where: { id: req.params.id, userId: req.userId, status: "active" },
        attributes: ["id", "title", "createdAt", "updatedAt"],
        include: {
          model: Message,
          attributes: ["id", "role", "content", "createdAt"],
        },
        order: [[Message, "createdAt", "ASC"]],
      });

      if (!session) {
        return res
          .status(404)
          .json({ success: false, error: "Sessão não encontrada" });
      }

      res.status(200).json({ success: true, data: session });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, error: "Erro ao buscar sessão" });
    }
  },
};
