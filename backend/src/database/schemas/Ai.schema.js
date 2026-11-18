import z from "zod"


export const createAiSchema = z.object({
    model: z.string(),
    prompt: z.string(),
    stream: z.boolean()
})