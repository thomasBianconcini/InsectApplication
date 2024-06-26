/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
