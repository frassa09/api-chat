import { DataTypes } from "sequelize";
import { sequelize } from "../database/init.js";


export const User = sequelize.define('User', {
    name: {
        allowNull: false,
        type: DataTypes.CHAR
    },
    email: {
        allowNull: false,
        type: DataTypes.CHAR,
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
        allowNull: false,
        type: DataTypes.CHAR,
        defaultValue: 'null'
    },
    system_instruction: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: 'null'
    }
}, {timestamps: true, tableName: 'user'})