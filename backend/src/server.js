import 'dotenv/config'
import express from 'express'
import { sequelize } from './database/init.js'
import { userRouter } from './routes/User.routes.js'

const app = express()
const port = process.env.API_PORT


app.use(express.json())

app.use('/user', userRouter)


app.get('/', (req, res) => {

    res.status(200).json({
        message: 'Aplicação rodando',
    })
})






sequelize.sync({alter: true}).then(() => {
    app.listen(port, () => console.log(`Aplicação rodando em http://localhost:${port}/`))
})