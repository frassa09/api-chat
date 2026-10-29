import { Message } from "../models/Message.model.js"


export const messageController = {

    registerMessageOnDb: async (sessionId, role, content) => {

        const bodyMessage = {
            content,
            role,
            sessionId
        }

        try {

            const response = await Message.create(bodyMessage, {returning: true, raw: true})

            return response
        }
        catch(err){
            console.log(err.message)
            return err
        }
    }
}