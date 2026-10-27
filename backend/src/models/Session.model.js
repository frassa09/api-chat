import { sequelize } from "../database/init";


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