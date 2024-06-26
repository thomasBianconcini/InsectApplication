import { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ListaInsettiScreen(props: { navigation: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [dangerous, SetDangerous]= useState(true);
    const nameDangerous=["Fruit flies","Armyworms","Colorado Potato Beetles","Corn Earworms","Brown Marmorated Stink Bugs"];
    const [imagesDangerous, setImagesDangerous] = useState([] as any[]);
    const [imagesNotDangerous, setImagesNotDangerous] = useState([] as any[]);
    const nameNotDangerous=["Ladybird", "Mosquito","Grasshopper", "Dragonfly","Butterfly"]

  useLayoutEffect(() => {
    const imagesDangerous = [
      require("../Images/fruitFlies.jpg"),
      require("../Images/Armyworms.jpg"),
      require("../Images/ColoradoPotatoBeetles.jpg"),
      require("../Images/CornEarworms.jpg"),
      require("../Images/BrownMarmoratedStinkBugs.jpg")
    ];
    
    const imagesNotDangerous =[
        require("../Images/Ladybird.jpg"),
        require("../Images/Mosquito.jpg"),
        require("../Images/Grasshopper.jpg"),
        require("../Images/Dragonfly.jpg"),
        require("../Images/Butterfly.jpg"),
    ]
    
    setImagesDangerous(imagesDangerous);
    setImagesNotDangerous(imagesNotDangerous);
  }, []); 
    var toRender=[];
    if(dangerous){
    for (var i = 0; i < imagesDangerous.length; i++) {
        toRender.push(
            <View style={[styles.element,{width:windowWidth}]} key={i}>
                <View style={{flex:0.5,width:windowWidth*50/100,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={imagesDangerous[i]}
                        style={{ width: windowWidth*40/100, height: 200 }}
                    />
                </View>
                <View style={{flex:0.5,flexDirection:'column',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'black'}}>{nameDangerous[i]}</Text>
                </View>
            </View>
        )
    }
    }else{
        for (var i = 0; i < imagesNotDangerous.length; i++) {
            toRender.push(
                <View style={[styles.element,{width:windowWidth}]} key={i}>
                    <View style={{flex:0.5,width:windowWidth*50/100,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                        <Image
                            source={imagesNotDangerous[i]}
                            style={{ width: windowWidth*40/100, height: 200 }}
                        />
                    </View>
                    <View style={{flex:0.5,flexDirection:'column',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'black'}}>{nameNotDangerous[i]}</Text>
                    </View>
                </View>
            )
        }
    }
    return (
    <>
    <View style={{flex:0.1, flexDirection:"row", alignContent:"space-between",alignItems:"center",justifyContent:"space-between",marginHorizontal:'10%'}}>
        <TouchableOpacity style={[styles.button,{backgroundColor:dangerous?'green': '#f4f4f4'}]} onPress={()=>{ SetDangerous(true) ,props.navigation.navigate("ListaInsetti")}}>
            <Text style={styles.buttonText}>PERICOLOSI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{backgroundColor:dangerous?'#f4f4f4': 'green'}]} onPress={()=>{SetDangerous(false) ,props.navigation.navigate("ListaInsetti")}}>
            <Text style={styles.buttonText}>DOCILI</Text>
        </TouchableOpacity>
    </View>
    <ScrollView style={{flex:0.9,height: windowHeight, width: windowWidth, flexDirection:"column",backgroundColor:"#e6e6e6"
    }}>
    {toRender}
    </ScrollView>
    </>)
}
const styles = StyleSheet.create({
    button: {
      width: '40%',
      height: 50,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: 'black',
    },
    element:{
        height:300, backgroundColor:'#f4f4f4',alignSelf:'center',borderRadius:5,borderColor:'#e6e6e6',
        flex:1, flexDirection:'row',alignContent:'center',justifyContent:"center", borderWidth: 2,
    }
  });