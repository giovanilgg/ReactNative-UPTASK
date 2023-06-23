import React from 'react';
import {Text, View, Pressable, StyleSheet, ScrollView} from 'react-native';
//navegacion
import {Rutas} from '../types/navegacion';
import {StackScreenProps} from '@react-navigation/stack';
type Props = StackScreenProps<Rutas, 'Proyectos'>;
//apollo cliente
import {useQuery} from '@apollo/client';
import {OBTENER_PROYECTOS} from '../mutationQuerys/mutationQuerys';
//Componentes
import Targeta from '../components/Targeta';
const Proyectos = ({navigation}: Props) => {
  //loading true | false en lo que hace la consulta
  const {data, loading, error} = useQuery(OBTENER_PROYECTOS);

  return (
    <View>
      <Pressable style={styles.btnNuevoProyecto}>
        <Text
          style={styles.btnNuevoProyectoTexto}
          onPress={() => navigation.navigate('ProyectoFormulario')}>
          Crear un nuevo proyecto
        </Text>
      </Pressable>
      <Text style={styles.subtituloInformativo}>
        Presiona para ver las tareas de tus proyectos
      </Text>
      <ScrollView>
        <View  style={styles.contenedorProyectos}  >
          {data &&
            data.obtenerProyectos.map((item: any) => (
              <Pressable
                style={styles.proyecto}
                key={item.id}
                onPress={() => {
                  navigation.navigate('Proyecto', item);
                }}>
                <Targeta proyecto={item}></Targeta>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  btnNuevoProyecto: {
    backgroundColor: '#db4648',
    padding: 12,
    marginTop: 20,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  btnNuevoProyectoTexto: {
    color: 'white',
    textAlign: 'center',
  },
  hover: {
    backgroundColor: 'white',
  },
  subtituloInformativo: {
    textAlign: 'center',
    marginVertical: 30,
    fontWeight: 'bold',
    fontSize: 20,
    marginHorizontal: 30,
  },
  contenedorProyectos: {
   flexDirection:'row',
   flexWrap:'wrap',
   justifyContent:'space-around',
  
   
  },
  proyecto: {
   backgroundColor:'#97BFB0',
   flexBasis:'40%',
   height:150,
   marginVertical:20,
   padding:8,
   alignItems:'center',
   justifyContent:'center',
   borderRadius:10
  },
});

export default Proyectos;
