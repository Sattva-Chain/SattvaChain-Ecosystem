import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

const HeroSection = () => {
  return (
    <View style={styles.container}>
      <Text  style={styles.TextConatier}>simple and user-friendly, conveys tracking herbs</Text>
      <Image 
        source={require('../../assets/Gemini_Generated_Image_hcl02qhcl02qhcl0.png')} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // centers content horizontally
    marginTop: 20,
    fontFamily:""
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 341,
    height: 260,
    borderRadius:30
  },
  TextConatier:{
    position:"absolute",
    top:70,
    zIndex:999,
    bottom:0,
    fontSize:20,
    fontWeight:"600",
    fontFamily:"ZalandoSansExpanded-VariableFont_wght",
    left:30,
    color:"#ffffffff"
  }
});

export default HeroSection;
