


const typeDefs = `
   #---------------------------Proyectos-------------------
   type Token{
      token:String
   }
   type Proyecto{
      nombre:String
      id:ID
   }
   
   input UsuarioInput{
      nombre:String!
      email:String!
      password:String!
   }
   input AutenticarInput{
      email:String!
      password:String!
   }
   input ProyectoInput{
      nombre:String!
   }
   #---------------------------Tareas-------------------
   input TareaInput{
      nombre:String!
      proyecto:String!
   }
   input ProyectoIdInput{
      proyecto:String!
   }
   type Tarea{
      nombre:String
      id:ID
      proyecto:String
      estado:Boolean
   }
   
  
   #---------------------------Mutation y Querys-------------------
   type Query{
      obtenerProyectos:[Proyecto]
      obtenerTareas(input:ProyectoIdInput):[Tarea]
   }
   type Mutation{
      #Proyectos
      crearUsuario(input:UsuarioInput):String
      autenticarUsuario(input:AutenticarInput):Token
      nuevoProyecto(input:ProyectoInput):Proyecto
      actualizarProyecto(id:ID!,input:ProyectoInput):Proyecto
      eliminarProyecto(id:ID!):String
      #Tareas
      nuevaTarea(input:TareaInput):Tarea
      actualizarTarea(id:ID!,input:TareaInput,estado:Boolean):Tarea
      eliminarTarea(id:ID!):String
      
   }
`;

module.exports = typeDefs;
