import React from 'react'
import {StyleSheet, Text} from 'react-native'

type Props={
  children:React.ReactNode
  color:string
}
const Alerta = ({children,color}:Props):JSX.Element => {
  return (
    <Text style={[alertaStyles.text,{color}]}> {children}</Text >)
}

const alertaStyles=StyleSheet.create({
  text:{
     textAlign:'center',
     marginBottom:5,
     marginTop:5,
  }
}) 


export default Alerta