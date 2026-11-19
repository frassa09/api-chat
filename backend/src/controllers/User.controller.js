import {
  createUserSchema,
  loginUserSchema,
} from "../database/schemas/User.schema.js";
import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import { User } from "../models/User.model.js";
import { generateJwt } from "../middlewares/generateJwt.js";

export const userController = {
  create: async (req, res) => {
    const user = req.body;

    const result = createUserSchema.safeParse(user);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message,
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
        data: {
          id: response.id,
          name: response.name,
          email: response.email,
        },
      });
    } catch (err) {
      console.log(err.message);

      if (err instanceof UniqueConstraintError) {
        return res.status(409).json({
          success: false,
          message: "E-mail já cadastrado",
        });
      }

      res.status(500).json({
        success: false,
        message: "Erro interno ao criar usuário",
      });
    }
  },
  login: async (req, res) => {
    const body = req.body;

    const result = loginUserSchema.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    try {
      const user = await User.findOne({
        where: { email: result.data.email },
      });

      const confirmPassword =
        user && (await bcrypt.compare(result.data.password, user.password_hash));

      if (!confirmPassword) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      const token = generateJwt({
        userId: user.id,
        name: user.name,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        token,
      });
    } catch (err) {
      console.log(err.message);

      return res.status(500).json({
        success: false,
        message: "Erro interno ao realizar login",
      });
    }
  },
};
