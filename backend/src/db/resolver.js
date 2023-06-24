//Librerias de terceros
const bcrypt = require("bcryptjs");
//Models
const Usuario = require("../models/Usuario");
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
//Utilidades
const { generarToken } = require("../utilities/generarToken");


const resolvers = {
  Query: {
    obtenerProyectos:async (_,{},contextValue) => {
     const proyectos = await Proyecto.find({creador:contextValue.usuario.id})
    
     return proyectos
    },
    obtenerTareas:async(_,{input},contextValue)=>{
      const tareas= await Tarea.find({creador:contextValue.usuario.id}).where('proyecto').equals(input.proyecto)
     return tareas
    }  
  },
  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { password, email } = input;
      //Verfificar si existe un usuario con el email
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error("El usuario ya esta registrado");
      }
      //hashear password
      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);
      try {
        //Registrar usuario
        const usuario = await new Usuario(input);
        usuario.save();
        return 'Usuario creado correctamente'
      } catch (error) {
        throw new Error("No se pudo registrar");
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { password, email } = input;
      //el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }
      //validar contraseña
      const passwordValido = await bcrypt.compare(
        password,
        existeUsuario.password
      );
      if (!passwordValido) {
        throw new Error("La contraseña es incorrecta");
      }
      //Acceso a la app
      return {
        token: generarToken(existeUsuario, process.env.FIRMATOKEN, "30d"),
      };
    },
    //generar un nuevo proyecto
    nuevoProyecto: async (_, { input }, contextValue) => {
      const { id } = contextValue.usuario;

      try {
        const proyecto = await new Proyecto(input);
        proyecto.creador = id;
        const resultado = await proyecto.save();
      
        return resultado;
      } catch (error) {
       
        console.log(error);
      }
    },
    //Actualizar un proyecto
    actualizarProyecto:async (_, { id,input }, contextValue) => {
      //Revisar si el proyecto existe
      let proyecto=await Proyecto.findById(id)
      if(!proyecto){
        throw new Error('No existe el proyecto')
      }
      //Revisar si es la persona que lo creo
      if(proyecto.creador.toString() !== contextValue.usuario.id){
        throw new Error('No se puede modificar,no es el usuario asignado')
      }
      //Guardar el proyecto
      proyecto= await Proyecto.findByIdAndUpdate({_id:id},input,{new:true})
      return proyecto
    },
    //eliminar Proyecto
    eliminarProyecto:async(_,{id},contextValue)=>{
       //Revisar si el proyecto existe
       let proyecto=await Proyecto.findById(id)
       if(!proyecto){
         throw new Error('No existe el proyecto')
       }
       //Revisar si es la persona que lo creo
       if(proyecto.creador.toString() !== contextValue.usuario.id){
         throw new Error('No se puede eliminar,no es el usuario asignado')
       }
       //eliminando
       await Proyecto.findByIdAndDelete({_id:id})
       return 'Proyecto eliminado'
    },
    //-----------------------Tareas-------------------
    //nueva tarea
    nuevaTarea:async(_,{input},contextValue)=>{
       try {
        const tarea=await  new Tarea(input)
        tarea.creador=contextValue.usuario.id
        const resultado= await tarea.save()
        return resultado
       } catch (error) {
         console.log(error)
       }
    },
    actualizarTarea:async(_,{id,input,estado},contextValue)=>{
      //Verificar si la tarea existe o no 
      let tarea= await  Tarea.findById(id)
      if(!tarea){
        throw new Error("No existe la tarea")
      }
      //Verficar si la persona que edita la tarea tiene acceso
      if(tarea.creador.toString() !== contextValue.usuario.id){
         
        throw new Error('No se puede modificar,no es el usuario asignado')
      }
      input.estado=estado
      //actualizar
     const resultado= await Tarea.findByIdAndUpdate({_id:id},input,{new:true})

     return resultado
    },
    
    //eliminar Proyecto
    eliminarTarea:async(_,{id},contextValue)=>{
       //Revisar si la tarea existe
       let tarea=await Tarea.findById(id)
       if(!tarea){
         throw new Error('No existe la tarea')
       }
       //Revisar si es la persona que lo creo
       if(tarea.creador.toString() !== contextValue.usuario.id){
         throw new Error('No se puede eliminar,no es el usuario asignado')
       }
       //eliminando
       await Tarea.findByIdAndDelete({_id:id})
       return 'Tarea eliminado'
    },
  },
};

module.exports = resolvers;
