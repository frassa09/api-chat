import { Session } from "../models/Session.model.js";
import { Message } from "../models/Message.model.js";
import { truncateTitle } from "../services/ai.service.js";

// Ids de sessão são inteiros; qualquer outra coisa é tratada como "não encontrada".
const isValidId = (id) => /^\d+$/.test(String(id));

// Busca uma sessão garantindo que pertence ao usuário. Retorna null se não existir.
export const findUserSession = async (sessionId, userId) => {
  if (!isValidId(sessionId)) return null;
  return Session.findOne({ where: { id: sessionId, userId, status: "active" } });
};

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
    if (!isValidId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, error: "Sessão não encontrada" });
    }

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
