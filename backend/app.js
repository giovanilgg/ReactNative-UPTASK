const Server = require('./src/models/server.js')

require("dotenv").config();
const server = new Server()
server.listen()
console.log('servidor corriendo')