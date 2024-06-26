import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useState, version } from "react";
import { loadTensorflowModel } from "react-native-fast-tflite";
import { TypedArray } from "@tensorflow/tfjs";

export function AnalisiScreen(props: { navigation: any, route: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [backend, setBackend] = useState<string | null>(null);
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
                console.log("result",output)
            } catch (error) {
                console.error('Error loading the model:', error);
            }
        };

        loadModel();
    }, []);
    const fetchAndAnalyzeImage = async () => {
        try {

        } catch (error) {
            console.error('Error during image analysis:', error);
        }
    };

    console.log( props.route.params.url)
    return (<View style={{
        flex: 1,
        height: windowHeight, width: windowWidth, flexDirection: "column", backgroundColor: "#e6e6e6"
    }}>
        <View style={{ flex: 0.5, backgroundColor: "#e6e6e6", justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={{ uri: props.route?.params?.url }}
                style={{ width: windowWidth * 60 / 100, height: 400 }}
            />
        </View>
        <View style={{ flex: 0.5, backgroundColor: "#e6e6e6", alignItems: "center" }}>
            <ScrollView style={{ marginBottom: '5%', width: windowWidth * 90 / 100, flexDirection: "column", backgroundColor: "#f4f4f4" }}>
            </ScrollView>
        </View>
        <TouchableOpacity style={styles.button} onPress={fetchAndAnalyzeImage}>
            <Text style={styles.buttonText}>Scatta Foto</Text>
        </TouchableOpacity>
    </View>)
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
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
    element: {
        height: 300, backgroundColor: '#f4f4f4', alignSelf: 'center', borderRadius: 5, borderColor: '#e6e6e6',
        flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: "center", borderWidth: 2,
    }
});