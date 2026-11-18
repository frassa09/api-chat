import { DataTypes } from "sequelize";
import { sequelize } from "../database/init.js";


export const User = sequelize.define('User', {
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        allowNull: false,
        type: DataTypes.TEXT
    },
    preferred_model_ai: {
        allowNull: true,
        type: DataTypes.STRING
    },
    system_instruction: {
        allowNull: true,
        type: DataTypes.TEXT
    }
})