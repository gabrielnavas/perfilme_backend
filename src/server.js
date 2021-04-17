const app = require('./app')

const env = require('./env')

const listening = () => console.log(`SERVER RUNNING IN ${env.server.port}`);
app.listen(env.server.port, listening)