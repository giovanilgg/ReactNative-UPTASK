const { Schema, model, default: mongoose } = require("mongoose");

const TareaSchema = Schema({
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
   
  },
  proyecto: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Proyecto'
  },
  estado:{
    type:Boolean,
    default:false
  }
});

module.exports = model("Tarea", TareaSchema);