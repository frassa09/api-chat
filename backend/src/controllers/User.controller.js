import {
  createUserSchema,
  loginUserSchema,
} from "../database/schemas/User.schema.js";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { generateJwt } from "../middlewares/generateJwt.js";

export const userController = {
  create: async (req, res) => {
    const user = req.body;

    const result = createUserSchema.safeParse(user);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.message,
        success: false,
      });
    }

    const password_hash = await bcrypt.hash(result.data.password, 10);

    const objToSave = {
      name: result.data.name,
      email: result.data.email,
      password_hash,
    };

    try {
      const response = await User.create(objToSave);

      res.status(201).json({
        success: true,
        data: response.dataValues,
      });
    } catch (err) {
      console.log(err.message);

      res.status(501).json({
        success: false,
        message: err.message,
      });
    }
  },
  login: async (req, res) => {
    const body = req.body;

    const result = loginUserSchema.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.message,
      });
    }

    try {
      const response = await User.findOne({
        where: { email: result.data.email },
      });

      const confirmPassword = bcrypt.compare(
        result.data.password,
        response.dataValues.password_hash,
      );

      if (confirmPassword) {
        const payload = {
          userId: response.dataValues.id,
          name: response.dataValues.name,
          email: response.dataValues.email,
        };

        const token = generateJwt(payload);

        res.status(200).json({
          success: true,
          message: "Login realizado com sucesso",
          token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Nenhum registro encontrado",
        });
      }
    } catch (err) {
      console.log(err.message);

      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  },
};
