import { useLayoutEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export function ListaInsettiScreen(props: { navigation: any }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [dangerous, SetDangerous] = useState(true);
    const nameDangerous = ["Fruit flies", "Armyworms", "Colorado Potato Beetles", "Corn Earworms", "Brown Marmorated Stink Bugs"];
    const [imagesDangerous, setImagesDangerous] = useState([] as any[]);
    const [imagesNotDangerous, setImagesNotDangerous] = useState([] as any[]);
    const nameNotDangerous = ["Ladybird", "Mosquito", "Grasshopper", "Dragonfly", "Butterfly"]

    useLayoutEffect(() => {
        const imagesDangerous = [
            require("../Images/fruitFlies.jpg"),
            require("../Images/Armyworms.jpg"),
            require("../Images/ColoradoPotatoBeetles.jpg"),
            require("../Images/CornEarworms.jpg"),
            require("../Images/BrownMarmoratedStinkBugs.jpg")
        ];

        const imagesNotDangerous = [
            require("../Images/Ladybird.jpg"),
            require("../Images/Mosquito.jpg"),
            require("../Images/Grasshopper.jpg"),
            require("../Images/Dragonfly.jpg"),
            require("../Images/Butterfly.jpg"),
        ]

        setImagesDangerous(imagesDangerous);
        setImagesNotDangerous(imagesNotDangerous);
    }, []);
    var toRenderD = [];
    var toRenderI = [];
    if (dangerous) {
        for (var i = 0; i < imagesDangerous.length; i++) {
            toRenderD.push(
                <LinearGradient
                    key={i}
                    colors={['#ffe0e0', '#ff6666']}
                    style={[styles.element, { width: windowWidth }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={{ flex: 0.5, width: windowWidth * 50 / 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={imagesDangerous[i]}
                            style={{ width: 180, height: 180 }}
                        />
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black' }}>{nameDangerous[i]}</Text>
                    </View>
                </LinearGradient>
            )
        }
    } else {
        for (var i = 0; i < imagesNotDangerous.length; i++) {
            toRenderI.push(
                <LinearGradient
                    key={i}
                    colors={['#e0ffe0', '#66ff66']} 
                    style={[styles.element, { width: windowWidth }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={{ flex: 0.5, width: windowWidth * 50 / 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={imagesNotDangerous[i]}
                            style={{ width: 180, height: 180 }}
                        />
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black' }}>{nameNotDangerous[i]}</Text>
                    </View>
                </LinearGradient>
            )
        }
    }
    return (
        <LinearGradient
            colors={['#add8e6', '#1e90ff']}  
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <>
                <View style={{ flex: 0.1, flexDirection: "row", alignContent: "space-between", alignItems: "center", justifyContent: "space-between", marginHorizontal: '10%' }}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: dangerous ? '#ff6666' : '#f4f4f4' }]} onPress={() => { SetDangerous(true); props.navigation.navigate("ListaInsetti") }}>
                        <Text style={styles.buttonText}>PERICOLOSI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: dangerous ? '#f4f4f4' : '#66ff66' }]} onPress={() => { SetDangerous(false); props.navigation.navigate("ListaInsetti") }}>
                        <Text style={styles.buttonText}>DOCILI</Text>
                    </TouchableOpacity>
                </View>
                {dangerous ?
                    <ScrollView style={{ flex: 0.9, height: windowHeight, width: windowWidth, flexDirection: "column", backgroundColor: "transparent"}}>
                        {toRenderD}
                    </ScrollView>
                    : <ScrollView style={{ flex: 0.9, height: windowHeight, width: windowWidth, flexDirection: "column", backgroundColor: "transparent" }}>
                        {toRenderI}
                    </ScrollView>
                }

            </>
        </LinearGradient>
    );
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
    element: {
        height: 300, backgroundColor: 'black', alignSelf: 'center', borderRadius: 5, borderColor: 'black',
        flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: "center", borderWidth: 1,
    }
});