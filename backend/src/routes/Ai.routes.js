import { Router } from "express";
import { aiController } from "../controllers/AI.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";



export const aiRouter = Router()

aiRouter.post('/new-session', verifyJwt, aiController.initializeSessionAndGenerate)