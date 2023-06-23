const { Schema, model, default: mongoose } = require("mongoose");

const ProyectoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    
  },
  creador: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Usuario'
  },
  creado: {
    type: Date,
    default:Date.now()
   
  }
});

module.exports = model("Proyecto", ProyectoSchema);