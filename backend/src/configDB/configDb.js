const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    //objeto de configuracion
    await mongoose.connect(process.env.MONGODB);
    console.log("Se conecto correctamente a la base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la base de datos");
  }
};
module.exports = {
  dbConnection,
};