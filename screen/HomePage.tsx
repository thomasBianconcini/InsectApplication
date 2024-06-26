import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
export function HomePageScreen(props: { navigation: any }) {

    const loadFromGallery = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        } as ImageLibraryOptions;
    
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else {
            let imageUri =  response.assets?.[0]?.uri;
            props.navigation.navigate("Analisi", {url:imageUri} )
          }
        });
      };
      const scattaFoto = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        } as ImageLibraryOptions;
    
        launchCamera(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else {
            let imageUri =  response.assets?.[0]?.uri;
            props.navigation.navigate("Analisi", {url:imageUri} )
          }
        });
      };
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    return (<View style={{
        flex: 1, height: windowHeight, width: windowWidth, flexDirection:"column",backgroundColor:"#ffffff"
    }}>
    <View style={{flex:0.3, backgroundColor:'red',alignSelf:'center',width:windowWidth*90/100}}>
        <TouchableOpacity style={styles.button} onPress={()=>{props.navigation.navigate("ListaInsetti")}}>
            <Text style={styles.buttonText}>Lista insetti</Text>
        </TouchableOpacity>
    </View>
    <View style={{flex:0.3, backgroundColor:'green',alignSelf:'center',width:windowWidth*90/100}} >
    <TouchableOpacity style={styles.button} onPress={loadFromGallery}>
            <Text style={styles.buttonText}>Carica da galleria</Text>
        </TouchableOpacity>
    </View>
    <View style={{flex:0.3, backgroundColor:'yellow',alignSelf:'center',width:windowWidth*90/100}}>
    <TouchableOpacity style={styles.button}onPress={scattaFoto}>
            <Text style={styles.buttonText}>Scatta Foto</Text>
        </TouchableOpacity>
    </View>
    </View>)
}
const styles = StyleSheet.create({
    button: {
      width: '100%',
      height: 50,
      borderRadius: 2,
      backgroundColor: '#f4f4f4',
      borderWidth: 3,
      borderColor: '#e6e6e6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: 'black',
    },
  });