import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

//react navigations
import {Rutas} from '../types/navegacion';
import {StackScreenProps} from '@react-navigation/stack';
//Formularios
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Components
import Alerta from '../components/Alerta';
type Props = StackScreenProps<Rutas, 'Proyecto'>;
//Apollo client
import {useMutation, useQuery} from '@apollo/client';
import {
  ACTUALIZAR_TAREA,
  NUEVA_TAREA,
  OBTENER_TAREAS,
  ELIMINAR_TAREA,
} from '../mutationQuerys/mutationQuerys';
//React-native icons
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
//hook
import usePantallaRetroceso from '../hooks/usePantallaRetroceso';
const Proyecto = ({route,navigation}: Props) => {
  const {id} = route.params;
  const [mensaje, setMensaje] = useState<string>('');
  const [idTarea, setIdTarea] = useState<string>('');
  //verificar pantalla
  const rutaActual= route.name
  usePantallaRetroceso(rutaActual,navigation)
  //Mutation y querys
  const {data, loading, error} = useQuery(OBTENER_TAREAS, {
    variables: {
      input: {
        proyecto: id,
      },
    },
  });
  const tareas = loading && <ActivityIndicator />;
  const [nuevaTarea] = useMutation(NUEVA_TAREA, {
    update(cache, {data: {nuevaTarea}}) {
      //Leer cache
      const {obtenerTareas}: any = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
      });
      //Rescribir cache
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
        data: {
          obtenerTareas: [...obtenerTareas, nuevaTarea],
        },
      });
    },
  });
  const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
  const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
    update(cache) {
        //Leer cache
      const {obtenerTareas}: any = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
      });

      //Filtrar y eliminar la tarea del cache
      const nuevoArrayTareas=obtenerTareas.filter((tarea:any)=>{
        return tarea.id !== idTarea
      })
   
      //Rescribir cache
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
        
        data: {
          obtenerTareas: nuevoArrayTareas,
        },
      });



    },
  });
  //Cambiar estado de tarea
  const handleTarea = async (tarea: any): Promise<void> => {
    const {id, estado, nombre, proyecto} = tarea;
  
    try {
      const {data} = await actualizarTarea({
        variables: {
          id,
          input: {
            nombre,
            proyecto,
          },
          estado: !estado,
        },
      });
    
    } catch (error) {
      console.log(error);
      
    }
  };
  //Eliminar Tarea
  const eliminarTareaA = (id: string) => {
    Alert.alert('Eliminar tarea?', 'Esta accion es irreversible', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const {data} = await eliminarTarea({
              variables: {
                id,
              },
            });
          
          } catch (error) {
            setMensaje('Lo sentimos no se pudo eliminar la tarea,intente mas tarde');
            setTimeout(() => {
              setMensaje('')
            }, 1000);
          }
        },
      },
    ]);
  };

  //Esquema de validaciones Yup
  const validacionProyecto = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
  });
  //Instancia de formik
  const {values, handleSubmit, setFieldValue, errors, touched, resetForm} =
    useFormik({
      initialValues: {
        nombre: '',
      },
      validationSchema: validacionProyecto,
      onSubmit: async values => {
        const {nombre} = values;
        try {
          const data = await nuevaTarea({
            variables: {
              input: {
                nombre,
                proyecto: id,
              },
            },
          });
          setMensaje('Tarea agregada correctamente');
          setTimeout(() => {
            resetForm();
            setMensaje('');
          }, 1000);
        } catch (error) {
          setMensaje('Lo sentimos algo sucedio mal,intentalo mas tarde');
          console.log(error);
        }
      },
    });

  return (
    <View style={styles.containerFormulario}>
      {mensaje && <Alerta color="#FAC43F">{mensaje}</Alerta>}
      <Image
        style={styles.img}
        source={require('../assets/img/tarea.png')}></Image>
      {errors.nombre && touched.nombre && (
        <Alerta color="#E68D77">{errors.nombre}</Alerta>
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={'#827C79'}
        placeholder="Ingresa el nombre de la tarea"
        keyboardType="default"
        value={values.nombre}
        onChangeText={e => {
          setFieldValue('nombre', e);
        }}
      />

      <Pressable style={styles.btnCrear} onPress={handleSubmit}>
        <Text style={styles.btnCrearTexto}>Crear Tarea</Text>
      </Pressable>
      <Text style={styles.subtituloInformativo}>
        Presiona para completar tu tarea
      </Text>
      {tareas}
      <ScrollView>
        {data ? (
          data.obtenerTareas.map((tarea: any) => (
            <Pressable
              style={styles.tarea}
              key={tarea.id}
              onPress={() => handleTarea(tarea)}
              onLongPress={() => {
                eliminarTareaA(tarea.id), setIdTarea(tarea.id);
              }}>
              <Text>{tarea.nombre}</Text>

              {tarea.estado ? (
                <Icon name="check-circle" size={30} color="#3072DF" />
              ) : (
                <Icon name="check-circle" size={30} color="#D5D9D7" />
              )}
            </Pressable>
          ))
        ) : (
          <Text>Por el momento no hay tareas</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFormulario: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
    alignItems: 'center',
  },
  img: {
    width: 70,
    height: 70,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#EEC3AE',
    marginHorizontal: 40,
    padding: 10,
    marginBottom: 10,
    marginVertical: 5,
  },
  btnCrear: {
    backgroundColor: '#db4648',
    padding: 12,
    marginHorizontal: 30,
    borderRadius: 10,
    width: 120,
  },
  btnCrearTexto: {
    color: 'white',
    textAlign: 'center',
  },
  tarea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    borderWidth: 1,
    borderColor: '#CFD1D4',
    padding: 10,
    marginVertical: 4,
    alignItems: 'center',
  },
  subtituloInformativo: {
    textAlign: 'center',
    marginVertical: 30,
    fontWeight: 'bold',
    fontSize: 20,
    marginHorizontal: 30,
  },
});

export default Proyecto;
