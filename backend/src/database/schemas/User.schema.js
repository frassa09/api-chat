import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(5, "O usuário deve ter pelo menos 5 caracteres")
    .max(30, "O usuário deve ter no máximo 30 caracteres"),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(6, "O senha deve ter pelo menos 6 dígitos")
    .max(30, "A senha deve ter no máximo 30 dígitos"),
});

export const loginUserSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(6, "O senha deve ter pelo menos 6 dígitos")
    .max(30, "A senha deve ter no máximo 30 dígitos"),
});
