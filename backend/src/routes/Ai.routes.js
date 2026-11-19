import { Router } from "express";
import { aiController } from "../controllers/AI.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";



export const aiRouter = Router()

aiRouter.use(verifyJwt)

aiRouter.post('/new-session', aiController.initializeSessionAndGenerate)
aiRouter.post('/sessions/:id/messages', aiController.generate)
aiRouter.post('/sessions/:id/title', aiController.generateTitle)
