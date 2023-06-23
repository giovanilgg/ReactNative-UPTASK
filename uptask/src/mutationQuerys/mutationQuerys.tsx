import {gql} from '@apollo/client';

//-------------------------mutations--------------------------------
const CREAR_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const NUEVO_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input: $input) {
      nombre
      id
    }
  }
`;

const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput) {
    nuevaTarea(input: $input) {
      nombre
      id
      proyecto
      estado
    }
  }
`;
const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
      nombre
      id
      proyecto
      estado
    }
  }
`;
const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id)
  }
`;
//-------------------------querys--------------------------------
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;
const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIdInput) {
    obtenerTareas(input: $input) {
      nombre
      id
      proyecto
      estado
    }
  }
`;
export {
  CREAR_CUENTA,
  AUTENTICAR_USUARIO,
  NUEVO_PROYECTO,
  OBTENER_PROYECTOS,
  NUEVA_TAREA,
  OBTENER_TAREAS,
  ACTUALIZAR_TAREA,
  ELIMINAR_TAREA,
};
