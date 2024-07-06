import { ActivityIndicator, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const [good, setGood] = useState(true);
    const[show,setShow]= useState(false)
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
          let standardizedArray = new Float32Array(224 * 224 * 3);

          for (let y = 0; y < 224; y++) {
              for (let x = 0; x < 224; x++) {
                  let index = (y * 224 + x) * 3;
                  standardizedArray[index] = (result[index] - mean[0]) / std[0];
                  standardizedArray[index + 1] = (result[index + 1] - mean[1]) / std[1];
                  standardizedArray[index + 2] = (result[index + 2] - mean[2]) / std[2];
              }
          }
          let inputTensor = [standardizedArray];

          console.log('Input tensor shape:', inputTensor.length);

            try {
                const model = await loadTensorflowModel(require('../Model/model_binary_classification_tflite.tflite'));
                console.log("Input model:", model.inputs);
                console.log(inputTensor)
                const output = await model.run( inputTensor );
                console.log(output);
                setResult(output.toString());
                if(output[0][0]<0.5)
                  setGood(false)
                else
                  setGood(true)
                setShow(true)
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
                style={{ width: 224, height: 224 }}
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
                  {show?
                  <>
                  {
                    good? <LinearGradient
                    colors={['#e0ffe0', '#66ff66']}   
                    style={[styles.button,{marginBottom:'25%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>Docile</Text>
                    </View>
                  </LinearGradient>
                    : <LinearGradient
                    colors={['#ffe0e0', '#ff6666']}   
                    style={[styles.button,{marginBottom:'25%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>Cattivo</Text>
                    </View>
                  </LinearGradient>
                  }
                 
                  <LinearGradient
                    colors={['#f0f0f0', '#bfbfbf']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>{(parseFloat(result) * 100).toFixed(2)}%</Text>
                    </View>
                  </LinearGradient>
                  </>
                  : 
                    <ActivityIndicator
                      style={{
                        backgroundColor: '#f4f4f4',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                      size={'large'}></ActivityIndicator>
                  }
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


