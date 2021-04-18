const express = require('express')
const cors = require('cors')

const routesUser = require('./infra/routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use(routesUser)

module.exports = app