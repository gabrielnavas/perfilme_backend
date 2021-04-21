const express = require('express')
const cors = require('cors')

const createUserRoute = require('./infra/routes/createUserRoute')
const loginRoute = require('./infra/routes/loginRoutes')

const app = express()

// essential middlewares
app.use(cors())
app.use(express.json())

// routes
app.use(createUserRoute)
app.use(loginRoute)

module.exports = app