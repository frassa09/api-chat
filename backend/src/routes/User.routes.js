import { Router } from "express";
import { userController } from "../controllers/User.controller.js";


export const userRouter = Router()


userRouter.post('/', userController.create)
userRouter.post('/login', userController.login)