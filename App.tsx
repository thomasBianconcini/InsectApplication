/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { HomePageScreen } from './screen/HomePage';
import { ListaInsettiScreen } from './screen/ListaInsetti';
import { AnalisiScreen } from './screen/Analisi';


function HomeScreen(props: { navigation: any }) {
  return (
    <HomePageScreen navigation={props.navigation}></HomePageScreen>
  );
}
function ListaInsetti(props: { navigation: any }) {
  return (
    <ListaInsettiScreen navigation={props.navigation}></ListaInsettiScreen>
  );
}
function Analisi(props: { navigation: any ,route: any}) {
  return (
    <AnalisiScreen navigation={props.navigation} route={props.route}></AnalisiScreen>
  );
}
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ListaInsetti" component={ListaInsetti} />
        <Stack.Screen name="Analisi" component={Analisi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
