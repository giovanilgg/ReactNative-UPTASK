import React from 'react'
import { Pressable, StyleSheet, Text ,View} from 'react-native'
type Props={
    proyecto:any
}
const Targeta = ({proyecto}:Props) => {

  return (
 
     <Text style={styles.titulo}>{proyecto.nombre}</Text>
   
   
  )
}
const styles= StyleSheet.create({
    titulo:{
       color:'#035A3A'
    }
})
export default Targeta