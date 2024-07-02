import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState, version } from "react";
import { loadTensorflowModel } from "react-native-fast-tflite";
import LinearGradient from "react-native-linear-gradient";
import ImageResizer from "react-native-image-resizer";
import { convertToRGB } from 'react-native-image-to-rgb';

export function AnalisiScreen(this: any, props: { navigation: any, route: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [result, setResult] = useState("");
    const [rgbArray, setRgbArray] = useState([]);
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
    const [pixels, setPixels] = useState<number[][] | null>(null);
    const handleCanvas= (canvas:any) => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'purple';
      ctx.fillRect(0, 0, 100, 100);
    }
    
    useEffect(() => {
        const loadModel = async () => {
          var todec=""
          if(props.route?.params?.base64){
            todec=props.route?.params?.base64
          }
          
          ImageResizer.createResizedImage(props.route?.params?.url, 224, 224, 'PNG', 100).then((resizedImage) => {
            setImageUri(resizedImage.uri)
            todec=resizedImage.uri
          }).catch((err) => {
            console.log(err);
          });

          var img=""
          if(props.route.params.url)
            img=props.route.params.url
          const result = await convertToRGB(img);
          console.log('Array di pixel:', result.length);
          let mean: number[] = [153.62967781, 154.31288711, 124.22471186];
          let std: number[] = [79.92603312, 75.5793136, 88.96403388];
          let rgbTriples: number[][] = [];

          for (let i = 0; i < result.length; i += 3) {
              let triple: number[] = [result[i], result[i + 1], result[i + 2]];
              rgbTriples.push(triple);
          }

          let standardizedArray = rgbTriples.map(rgb => {
            let standardizedRGB = [
                (rgb[0] - mean[0]) / std[0],
                (rgb[1] - mean[1]) / std[1],
                (rgb[2] - mean[2]) / std[2]
            ];
            return standardizedRGB;
        });
          console.log( standardizedArray);
            try {
                let numberOfArrays = 1; 
                let lengthOfEachArray = 2296;
                let min = -2;
                let max = 2;
                const model = await loadTensorflowModel(require('../Model/model_volume_lite.tflite'));
                let randomTypedArrays: Float32Array[] = generateRandomTypedArrays(numberOfArrays, lengthOfEachArray, min, max);
                const output = await model.run(randomTypedArrays)
                setResult(output.toString())
            } catch (error) {
                console.error('Error loading the model:', error);
            }
        };

        loadModel();
    }, []);

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
                style={{ width: windowWidth * 40/ 100, height: windowHeight*40/100 }}
              />
            </View>
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <View style={styles.scrollView}>
                <View style={{flex:0.5, alignItems:"center",justifyContent:"center"}}>
                  <Image
                    source={ require("../Images/Ladybird.jpg")}
                    style={{ width: windowWidth * 40 / 100, height: windowHeight*40/100 }}
                  />
                </View >
                <View style={{flex:0.5, alignItems:"center",justifyContent:"center"}}>
                  <LinearGradient
                    colors={['#e0ffe0', '#66ff66']}   
                    style={[styles.button,{marginBottom:'25%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>Docile o Cattivo</Text>
                    </View>
                  </LinearGradient>
                  <LinearGradient
                    colors={['#f0f0f0', '#bfbfbf']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>{result}</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      );
    }
const styles = StyleSheet.create({
  buttonContent: {
    flex: 1,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center'
  },
    button: {
        width: '90%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f4f4f4',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        marginBottom: '5%',
        width: '90%',
        height:'98%',
        flexDirection: "row",
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


