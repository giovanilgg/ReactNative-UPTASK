const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    trim:true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatorio"],
   
  },
  registro: {
    type:Date,
    default:Date.now()
  },
});

module.exports = model("Usuario", UsuarioSchema);
