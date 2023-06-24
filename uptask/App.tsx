import 'react-native-gesture-handler';
import React from 'react';

import {Alert, StyleSheet} from 'react-native';
//reactNative navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//types
import {Rutas} from './src/types/navegacion';
//views
import Login from './src/views/login';
import CrearCuenta from './src/views/crearCuenta';
import Proyectos from './src/views/proyectos';
import ProyectoFormulario from './src/views/proyectoFormulario';
import Proyecto from './src/views/proyecto';
//icon
import Icon from 'react-native-vector-icons/FontAwesome';
//apollo cliente
import {useApolloClient, useQuery} from '@apollo/client';
//async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): JSX.Element {
  const Stack = createStackNavigator<Rutas>();
  const client = useApolloClient();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {},
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
            component={Login}
          />
          <Stack.Screen
            name="CrearCuenta"
            options={{
              title: 'Crear Cuenta',
              headerStyle: {
                backgroundColor: '#5f9ea0',
              },
              headerTintColor: 'white',
            }}
            component={CrearCuenta}
          />
          <Stack.Screen
            name="Proyectos"
            options={({navigation}) => ({
              title: 'Proyectos',
              headerStyle: {
                backgroundColor: '#5f9ea0',
              },
              headerTintColor: 'white',
              headerLeft: () => <></>,

              headerRight: () => (
                <Icon
                  style={{
                    marginRight: 20,
                  }}
                  onPress={() => {
                    Alert.alert('¿Salir de la cuenta?', undefined, [
                      {
                        text: 'NO',
                        style: 'cancel',
                      },
                      {
                        text: 'Si',
                        onPress: async () => {
                          try {
                            await AsyncStorage.clear();
                            await client.resetStore();
                          } catch (e) {
                            console.log(e);
                          }
                          setTimeout(() => {
                            navigation.navigate('Login');
                          }, 1000);
                        },
                      },
                    ]);
                  }}
                  name="power-off"
                  size={30}
                  color="white"
                />
              ),
            })}
            component={Proyectos}
          />
          <Stack.Screen
            name="ProyectoFormulario"
            options={{
              title: 'Crear Proyecto',
              headerStyle: {
                backgroundColor: '#5f9ea0',
              },
              headerTintColor: 'white',
            }}
            component={ProyectoFormulario}
          />
          <Stack.Screen
            name="Proyecto"
            options={({route}) => ({
              title: route.params.nombre,
              headerStyle: {
                backgroundColor: '#5f9ea0',
              },
              headerTintColor: 'white',
            })}
            component={Proyecto}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});

export default App;
