import 'dotenv/config'
import {Sequelize} from 'sequelize'

const loggingString = process.env.DATABASE_URL

export const sequelize = new Sequelize(loggingString, {ssl: true})