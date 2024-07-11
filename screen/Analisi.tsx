import { ActivityIndicator, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState, version } from "react";
import { loadTensorflowModel } from "react-native-fast-tflite";
import LinearGradient from "react-native-linear-gradient";
import ImageResizer from "react-native-image-resizer";
import { convertToRGB } from 'react-native-image-to-rgb';
import RNFS from 'react-native-fs';

export function AnalisiScreen(this: any, props: { navigation: any, route: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [binary, setBinary] = useState(true);
    const [result, setResult] = useState("");
    const [index, setIndex] = useState(0);
    const [value, setValue] = useState("");
    const [good, setGood] = useState(true);
    const [name,setName]=useState("");
    const[show,setShow]= useState(false)
    const [images, setImages] = useState([] as any[]);
    useLayoutEffect(() => {
      const images = [
          require("../Images/Armyworms.jpg"),
          require("../Images/BrownMarmoratedStinkBugs.jpg"),
          require("../Images/ColoradoPotatoBeetles.jpg"),
          require("../Images/CornEarworms.jpg"),
          require("../Images/fruitFlies.jpg"),
          require("../Images/Butterfly.jpg"),
          require("../Images/Dragonfly.jpg"),
          require("../Images/Grasshopper.jpg"),
          require("../Images/Ladybird.jpg"),
          require("../Images/Mosquito.jpg")
      ];

      setImages(images);
  }, []);
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
          var todec=""
          if(props.route?.params?.base64){
            todec=props.route?.params?.base64
          }
          var img=""
          if(props.route.params.url){
            const newFilePath = `${RNFS.DocumentDirectoryPath}/selectedImage.jpg`;
            await RNFS.copyFile(props.route.params.url, newFilePath);
          
            img = `file://${newFilePath}`;
          }
          console.log(props.route.params.url)
          const result = await convertToRGB(img);
          console.log('Array di pixel:', result.length);
          let mean: number[] = [146.48107588, 148.63667783, 111.89538171];
          let std: number[] = [76.88493199, 71.21221079, 83.31565906];

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

          let mean2: number[] = [146.98982439, 149.45220133, 113.56279486];
          let std2: number[] =  [77.7491212,  71.79544398, 83.96504595];

          let standardizedArray2 = new Float32Array(224 * 224 * 3);

          for (let y = 0; y < 224; y++) {
              for (let x = 0; x < 224; x++) {
                  let index = (y * 224 + x) * 3;
                  standardizedArray2[index] = (result[index] - mean[0]) / std[0];
                  standardizedArray2[index + 1] = (result[index + 1] - mean[1]) / std[1];
                  standardizedArray2[index + 2] = (result[index + 2] - mean[2]) / std[2];
              }
          }
          let inputTensor2 = [standardizedArray2];
            try {
                const model = await loadTensorflowModel(require('../Model/model_binary_classification_tflite_2.tflite'));
                console.log("Input model:", model.inputs);
                const output = await model.run( inputTensor );
                console.log(output);
                setResult(output.toString());
                if(output[0][0]<0.5)
                  setGood(false)
                else
                  setGood(true)
                setShow(true)
                const model2 = await loadTensorflowModel(require('../Model/model_10_classification_mobilenetsemi_tflite.tflite'));
                console.log("Input model:", model2.inputs);
                const output2 = await model2.run( inputTensor2 );
                var maxVal:number=0.00;
                let maxIndex = -1;
                for (const el in output2[0]) {
                  console.log(el)
                  if(output2[0][el]>=maxVal){
                      maxVal=output2[0][el]
                      maxIndex=parseInt(el)
                  }
                }
                const insect_list = ["Armyworms", "Brown_Marmorated_Stink_Bugs","Colorado_Potato_Beetles","Corn_Earworms","Fruit_Flies","Butterfly","Dragonfly","Grasshopper","Ladybird","Mosquito"]
                setIndex(maxIndex)
                setName(insect_list[maxIndex])
                setValue(maxVal.toString())
                console.log('Valore massimo:', maxVal);
                console.log('Indice del valore massimo:', maxIndex);
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
            {binary?
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <View style={styles.scrollView}>
                <View style={{flex:1, alignItems:"center",justifyContent:"center"}}>
                  {show?
                  <>
                  {
                    good? <LinearGradient
                    colors={['#e0ffe0', '#66ff66']}   
                    style={[styles.buttonBinary,{marginBottom:'15%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>Docile</Text>
                    </View>
                  </LinearGradient>
                  
                    : <LinearGradient
                    colors={['#ffe0e0', '#ff6666']}   
                    style={[styles.buttonBinary,{marginBottom:'15%'}]}
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
                    style={styles.buttonBinary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      {
                        good?<Text style={styles.buttonText}>{(parseFloat(result) * 100).toFixed(2)}%</Text>
                        : <Text style={styles.buttonText}>{Math.abs(parseFloat(result) * 100 - 100).toFixed(2)}%</Text>
                      }
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
              <View style={{flex:0.25, width:windowWidth*40/100}}>
              <LinearGradient
                colors={['#f0f0f0', '#bfbfbf']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <TouchableOpacity style={styles.buttonContent} onPress={()=>setBinary(false)}>
                  <Text style={styles.buttonText}>Classifcation</Text>
                </TouchableOpacity>
              </LinearGradient>
              </View>
            </View>
            :
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <View style={styles.scrollView}>
                <View style={{flex:0.5, alignItems:"center",justifyContent:"center"}}>
                  <Image
                    source={ images[index]}
                    style={{ width: 150, height: 150 }}
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
                    <View style={[styles.buttonContent]} >
                      <Text style={[styles.buttonText]}>{name}</Text>
                    </View>
                  </LinearGradient>
                  
                    : <LinearGradient
                    colors={['#ffe0e0', '#ff6666']}   
                    style={[styles.button,{marginBottom:'25%'}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>{name}</Text>
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
                      <Text style={styles.buttonText}>{(parseFloat(value) * 100).toFixed(2)}%</Text>
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
              <View style={{flex:0.25, width:windowWidth*40/100}}>
              <LinearGradient
                colors={['#f0f0f0', '#bfbfbf']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                 <TouchableOpacity style={styles.buttonContent} onPress={()=>setBinary(true)}>
                  <Text style={styles.buttonText}>Binary</Text>
                </TouchableOpacity>
              </LinearGradient>
              </View>
            </View>
          }
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
    buttonBinary: {
      width: '60%',
      height: 50,
      borderRadius: 25,
      backgroundColor: '#f4f4f4',
      borderWidth: 1,
      borderColor: '#e6e6e6',
      justifyContent: 'center',
      alignItems: 'center',
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
        flex:0.75,
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


