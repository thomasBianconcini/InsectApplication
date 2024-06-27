import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useState, version } from "react";
import { loadTensorflowModel } from "react-native-fast-tflite";
import { TypedArray } from "@tensorflow/tfjs";
import LinearGradient from "react-native-linear-gradient";

export function AnalisiScreen(props: { navigation: any, route: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [result, setResult] = useState("");
    function generateRandomTypedArrays(length: number, arrayLength: number, min: number, max: number): Float32Array[] {
        let arrays: Float32Array[] = [];
        for (let i = 0; i < length; i++) {
            let typedArray = new Float32Array(arrayLength);
            for (let j = 0; j < arrayLength; j++) {
                typedArray[j] = Math.random() * (max - min) + min;
            }
            arrays.push(typedArray);
        }
        return arrays;
    }
    
    
    useEffect(() => {
        const loadModel = async () => {
            try {
                let numberOfArrays = 1;  // numero di TypedArray
                let lengthOfEachArray = 2296;  // lunghezza di ciascun TypedArray
                let min = -2;
                let max = 2;
                const model = await loadTensorflowModel(require('../Model/model_volume_lite.tflite'));
                console.log(model.inputs);
                let randomTypedArrays: Float32Array[] = generateRandomTypedArrays(numberOfArrays, lengthOfEachArray, min, max);
                const output = await model.run(randomTypedArrays)
                console.log(output)
                setResult(output.toString())
            } catch (error) {
                console.error('Error loading the model:', error);
            }
        };

        loadModel();
    }, []);

    console.log( props.route.params.url)

    return (
        <LinearGradient
          colors={['#add8e6', '#1e90ff']}  
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{
            flex: 1,
            height: windowHeight, width: windowWidth, flexDirection: "column"
          }}>
            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: props.route?.params?.url }}
                style={{ width: windowWidth * 60 / 100, height: 400 }}
              />
            </View>
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.buttonText}> {result}</Text>
              </ScrollView>
            </View>
          </View>
        </LinearGradient>
      );
    }
const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: 2,
        backgroundColor: '#f4f4f4',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        marginBottom: '5%',
        width: '90%',
        flexDirection: "column",
        backgroundColor: "#f4f4f4",
        borderRadius: 10, 
      },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
    element: {
        height: 300, backgroundColor: '#f4f4f4', alignSelf: 'center', borderRadius: 5, borderColor: '#e6e6e6',
        flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: "center", borderWidth: 2,
    }
});