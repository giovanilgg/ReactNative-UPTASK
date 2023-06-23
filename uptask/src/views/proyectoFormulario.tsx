import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
//navegacion
import {Rutas} from '../types/navegacion';
import {StackScreenProps} from '@react-navigation/stack';
type Props = StackScreenProps<Rutas, 'ProyectoFormulario'>;
//Formularios
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Componentes
import Alerta from '../components/Alerta';
//Apolo Client
import {useMutation} from '@apollo/client';
import {
  NUEVO_PROYECTO,
  OBTENER_PROYECTOS,
} from '../mutationQuerys/mutationQuerys';

const ProyectoFormulario = ({navigation}: Props) => {
  //Actualizacion de cache para traer de nuevo los proyectos
  const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
    update(cache, {data: {nuevoProyecto}}) {
      
      const {obtenerProyectos}: any = cache.readQuery({
        query: OBTENER_PROYECTOS,
      });
      cache.writeQuery({
        query: OBTENER_PROYECTOS,
        
        data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])},
      });
    },
  });
  const [mensaje, setMensaje] = useState<string>('');

  //Esquema de validaciones Yup
  const validacionProyecto = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
  });
  //Instancia de formik
  const {values, handleSubmit, setFieldValue, errors, touched} = useFormik({
    initialValues: {
      nombre: '',
    },
    validationSchema: validacionProyecto,
    onSubmit: async values => {
      const {nombre} = values;
    
      try {
        const {data} = await nuevoProyecto({
          variables: {
            input: {
              nombre,
            },
          },
        });
        setMensaje('Proyecto agregado correctamente');
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } catch (error) {
        setMensaje('Algo salio mal,intente mas tarde');
      }
    },
  });

  return (
    <View style={styles.containerFormulario}>
      {mensaje && <Alerta color="#FAC43F">{mensaje}</Alerta>}
      <Image
        style={styles.img}
        source={require('../assets/img/nuevo.png')}></Image>
      {errors.nombre && touched.nombre && (
        <Alerta color="#E68D77">{errors.nombre}</Alerta>
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={'#827C79'}
        placeholder="Ingresa el nombre de tu proyecto"
        keyboardType="default"
        value={values.nombre}
        onChangeText={e => {
          setFieldValue('nombre', e);
        }}
      />

      <Pressable style={styles.btnCrear} onPress={handleSubmit}>
        <Text style={styles.btnCrearTexto}>Crear</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFormulario: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  img: {
    width: 70,
    height: 70,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#EEC3AE',
    marginHorizontal: 40,
    padding: 10,
    marginBottom: 30,
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
});
export default ProyectoFormulario;
