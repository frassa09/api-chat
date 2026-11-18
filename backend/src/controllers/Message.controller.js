import { Message } from "../models/Message.model.js";

export const messageController = {
  registerMessageOnDb: async (sessionId, role, content) => {
    return Message.create({ content, role, sessionId });
  },
};
