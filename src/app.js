const express = require('express')
const cors = require('cors')

const routesUser = require('./infra/routes/userRoutes')
const authenticationRoutes = require('./infra/routes/authenticationRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use(routesUser)
app.use(authenticationRoutes)

module.exports = app