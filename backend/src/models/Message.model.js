import { DataTypes } from "sequelize";
import { sequelize } from "../database/init.js";


export const Message = sequelize.define('Message', {
    content: {
        allowNull: false,
        type: DataTypes.STRING
    },
    role: {
        allowNull: false,
        type: DataTypes.ENUM('ia', 'user'),
    },
    tokens: {
        allowNull: true,
        type: DataTypes.INTEGER
    }
    
})