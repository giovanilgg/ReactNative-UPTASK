const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
//dependencias externas
const jwt = require("jsonwebtoken");
//resolver y type defs
const typeDefs = require("../db/schemas");
const resolvers = require("../db/resolver");
//conexion db
const { dbConnection } = require("../configDB/configDb");

class Server {
  constructor() {
    this.app = new ApolloServer({
      typeDefs,
      resolvers
    });
    this.conexionDb();
  }
  //conexion db
  async conexionDb() {
    await dbConnection();
  }
  //corriendo el server
  async listen() {
    const { url } = await startStandaloneServer(this.app, {
      context: async ({ req }) => {
        const token =req.headers.authorization || ''
        
        
        if (token) {
          try {
            const usuario = jwt.verify(token.replace('Bearer ',''), process.env.FIRMATOKEN);
            return{
              usuario
            }
          } catch (error) {
            console.log(error);
          }
        } 
      },
      listen: { port: 4000 },
    });

    console.log(`Server corriendo en: ${url}`);
  }
}

module.exports = Server;
