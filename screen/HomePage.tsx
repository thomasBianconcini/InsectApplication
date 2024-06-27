import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
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
        let imageUri = response.assets?.[0]?.uri;
        props.navigation.navigate("Analisi", { url: imageUri })
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
        let imageUri = response.assets?.[0]?.uri;
        props.navigation.navigate("Analisi", { url: imageUri })
      }
    });
  };
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <LinearGradient
      colors={['#add8e6', '#1e90ff']}
      style={{ flex: 1, height: windowHeight, width: windowWidth, justifyContent:"center" }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.buttonContainer}>
      <LinearGradient
        colors={['#f0f0f0', '#bfbfbf']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.buttonContent}onPress={() => { props.navigation.navigate("ListaInsetti") }}>
          <Text style={styles.buttonText}>Lista insetti</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#f0f0f0', '#bfbfbf']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.buttonContent}  onPress={loadFromGallery}>
          <Text style={styles.buttonText}>Carica da galleria</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#f0f0f0', '#bfbfbf']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.buttonContent} onPress={scattaFoto}>
          <Text style={styles.buttonText}>Scatta Foto</Text>
        </TouchableOpacity>
      </LinearGradient>
      </View>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent:"center",
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25, 
    marginBottom: 20,
  },
  buttonContent: {
    flex: 1,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});