import { Router } from "express";
import { sessionController } from "../controllers/Session.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";



export const sessionRouter = Router()

sessionRouter.use(verifyJwt)

sessionRouter.get('/', sessionController.list)
sessionRouter.get('/:id', sessionController.getWithMessages)
