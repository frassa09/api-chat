import z from "zod"


export const createAiSchema = z.object({
    model: z.string(),
    prompt: z.string().min(1),
    stream: z.boolean()
})

export const chatAiSchema = z.object({
    model: z.string(),
    messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1)
    })).min(1),
    stream: z.boolean()
})

export const messageBodySchema = z.object({
    message: z.string().trim().min(1, "A mensagem não pode ser vazia").max(5000)
})
