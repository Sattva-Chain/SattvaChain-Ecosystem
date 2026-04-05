import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
const WorlFlow = () => {
  return (
    <View style={style.main} >
      <View style={style.cainer}>
        <View style={style.imagesCotainer}>
          <Image style={style.image} source={require('../../assets/Gemini_Generated_Image_22rtsa22rtsa22rt.png')} />
          <Text style={style.textIMage}>Farmer</Text>
        </View>
        <View style={style.ArrowContainer}>
          <Icon name="arrow-right" size={15} color="#255340ff" />
        </View>
        <View>
          <Image style={style.image} source={require('../../assets/Gemini_Generated_Image_22rtsa22rtsa22rt(1).png')} />
          <Text style={style.textIMage} >laboratory</Text>
        </View>
        <View style={style.ArrowContainer}>
          <Icon name="arrow-right" size={15} color="#255340ff" />
        </View>
        <View >
          <Image style={style.image} source={require('../../assets/Gemini_Generated_Image_22rtsa22rtsa22rt(2).png')} />
          <Text style={style.textIMage} >Consumer</Text>
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  main:{
    paddingTop:10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  cainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  ArrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },

  imagesCotainer: {

    justifyContent: "center"
  }
  ,
  textIMage: {
    fontSize: 12,
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    textAlign: "center",
    marginTop: 5,
    color: "#2d6935ff"

  }
})
export default WorlFlow