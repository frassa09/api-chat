import { Session } from "../models/Session.model.js";

export const sessionController = {
  registerSessionOnDb: async (userId, firstMessage) => {
    const sessionToSave = {
        title: firstMessage,
        status: 'active',
        userId
    };

    try {
        const response = await Session.create(sessionToSave, {returning: true, raw: true})

        return response
    } catch (err) {

        console.log(err.message)
        return err
    }
  },
};
