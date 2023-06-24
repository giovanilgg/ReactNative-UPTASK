import React, {useState, useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';

const usePantallaRetroceso = (pantalla: string, navigation: any) => {
  const [pantallaActiva] = useState(pantalla);
  useEffect(() => {
    const handleBackButton = () => {
      if (pantallaActiva === 'Proyectos') {
        Alert.alert('Cerrar!', '¿Usted esta seguro de salir de la app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: async () => {
              try {
              } catch (e) {
                console.log(e);
              }
              BackHandler.exitApp();
            },
          },
        ]);
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);
};

export default usePantallaRetroceso;
