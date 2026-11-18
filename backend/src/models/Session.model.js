import { DataTypes } from "sequelize";
import { sequelize } from "../database/init.js";


export const Session = sequelize.define('Session', {
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM('active', 'archived', 'deleted'),
        defaultValue: 'active'
    }
})