require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express() 

const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const todoRouter = require('./routes/todo')
const authMiddleware = require('./middleware/authentication')
const notfoundMiddleware = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/errorhandler')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const expressRateLimitter = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.use(express.json())
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(expressRateLimitter({windowsMs : 60 * 1000, max : 60}))

app.get('/', (req, res) => {
    res.send(`<h1>To-Do App</h1><a href='/api-docs5'>Documentation</a>`)
})
app.use('/api-docs5', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/todo', authMiddleware, todoRouter)

app.use(notfoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3500
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()