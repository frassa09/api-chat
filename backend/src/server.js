import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { sequelize } from './database/init.js'
import { userRouter } from './routes/User.routes.js'
import { aiRouter } from './routes/Ai.routes.js'
import { sessionRouter } from './routes/Session.routes.js'
import './models/relations.js'

const app = express()
const port = process.env.API_PORT


app.use(cors())
app.use(express.json())

app.use('/user', userRouter)
app.use('/ai', aiRouter)
app.use('/sessions', sessionRouter)

app.get('/', (req, res) => {

    res.status(200).json({
        message: 'Aplicação rodando',
    })
})






sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Aplicação rodando em http://localhost:${port}/`))
})