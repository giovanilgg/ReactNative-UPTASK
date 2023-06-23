import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native';
//Formularios
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Apolo Client
import {useMutation} from '@apollo/client';
import {AUTENTICAR_USUARIO} from '../mutationQuerys/mutationQuerys';
//navegacion
import {Rutas} from '../types/navegacion';
import {StackScreenProps} from '@react-navigation/stack';
//Components
import Alerta from '../components/Alerta';
//Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
type Props = StackScreenProps<Rutas, 'Login'>;

const Login = ({navigation}: Props) => {
  const [mensaje, setMensaje] = useState<string>('');

  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  //Esquema de validaciones Yup
  const validacionUsuario = Yup.object().shape({
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(6, 'La contraseña en de minimo 6 caracteres'),
    email: Yup.string()
      .required('El email es obligatorio ')
      .email('El email no es valido'),
  });
  //Instancia de formik
  const {values, handleSubmit, setFieldValue, errors, touched} = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validacionUsuario,
    onSubmit: async values => {
      const {email, password} = values;
      //Guardar Usuario
      try {
        const {data} = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        //Asignar el token al asyncStorage
        const {token} = data.autenticarUsuario;
        await AsyncStorage.setItem('token', token);
        setTimeout(() => {
          setMensaje('')
          navigation.navigate('Proyectos')
        }, 1000);

      } catch (error: any) {
        setMensaje(error.message);
      }
    },
  });

  return (
    <View style={styles.containerForm}>
      <View>
        <Text style={styles.titulo}>
          Up <Text style={styles.tituloNegritas}>Task</Text>
        </Text>

        <View>
          {errors.email && touched.email && (
            <Alerta color="white">{errors.email}</Alerta>
          )}
          <TextInput
            style={styles.formInput}
            keyboardType="email-address"
            value={values.email}
            onChangeText={e => {
              setFieldValue('email', e);
            }}
            placeholder="Introduce tu correo electronico"
          />
        </View>
        <View>
          {errors.password && touched.password && (
            <Alerta color="white">{errors.password}</Alerta>
          )}
          <TextInput
            style={styles.formInput}
            secureTextEntry={true}
            value={values.password}
            onChangeText={e => {
              setFieldValue('password', e);
            }}
            placeholder="Introduce tu contraseña"
          />
        </View>
        <Pressable style={styles.btnIngresar} onPress={handleSubmit}>
          <Text style={styles.btnIngresarTexto}>Ingresar</Text>
        </Pressable>
        <Pressable
          style={styles.btnCrearCuenta}
          onPress={() => navigation.navigate('CrearCuenta')}>
          <Text style={styles.btnCrearCuentaNombre}>Crear una cuenta</Text>
        </Pressable>
        {mensaje && <Alerta color="white">{mensaje}</Alerta>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerForm: {
    backgroundColor: '#5f9ea0',
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 50,
    marginBottom: 50,
    color: '#db4648',
    fontWeight: '600',
  },
  tituloNegritas: {
    fontWeight: '900',
    color: 'black',
  },
  formInput: {
    marginHorizontal: 50,
    backgroundColor: 'white',
    marginTop: 2,
    marginBottom: 9,
    padding: 12,
  },
  btnIngresar: {
    backgroundColor: '#db4648',
    padding: 10,
    marginHorizontal: 70,
    marginBottom: 20,
    marginTop: 20,
  },
  btnCrearCuenta: {
    marginHorizontal: 70,
  },
  btnCrearCuentaNombre: {
    textAlign: 'center',
  },
  btnIngresarTexto: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Login;
