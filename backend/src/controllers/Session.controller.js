import { Session } from "../models/Session.model.js";

const TITLE_MAX_LENGTH = 100;

export const sessionController = {
  registerSessionOnDb: async (userId, firstMessage) => {
    const title =
      firstMessage.length > TITLE_MAX_LENGTH
        ? `${firstMessage.slice(0, TITLE_MAX_LENGTH - 3)}...`
        : firstMessage;

    return Session.create({ title, status: "active", userId });
  },
};
