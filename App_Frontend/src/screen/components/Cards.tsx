import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
const Cards = () => {
  return (
    <View>
          <View style={styles.TextContainer}>
                  <Text style={styles.Text}>Complete Herb Traceability Solution</Text>
                  <Text style={styles.smallText}>From seed to shelf, every step is verified and recorded</Text>
                </View>
          
                <View style={styles.container}>
                  <View style={styles.Card}>
                    <Icon name='user' style={styles.Icons}/>
                    <Text style={styles.boxText} >Secure Farmer Identity</Text>
                    <Text style={styles.BOXtext2}>Farmer KYC & cooperative ID on blockchain.</Text>
                  </View>
                  <View style={styles.Card}>
                     <Icon name='map-marker-alt' style={styles.Icons}/>
                    <Text style={styles.boxText} >Geo-Tagged Collection</Text>
                    <Text style={styles.BOXtext2}>GPS tracking with offline & SMS backup.</Text>
                  </View>
                  <View style={styles.Card}>
                     <Icon name="check-circle" size={24} color="green" style={styles.Icons} />
          
                    <Text style={styles.boxText} >Verified Harvest</Text>
                    <Text style={styles.BOXtext2}>Immutable records & sustainability checks.</Text>
                  </View>
                </View>
          </View>
    
  )
}

const styles = StyleSheet.create({
  boxText:{
    fontSize:8,
    fontWeight:"600",  
    color:"#255340ff",
    textAlign:"center",
    fontFamily:"ZalandoSansExpanded-VariableFont_wght"
  
  },
  BOXtext2:{
   fontSize:9,
    textAlign:"center",
    fontFamily:"ZalandoSansExpanded-VariableFont_wght"
  },
  Icons:{
    fontSize:20,
    color:"#2d6935ff"
  },
  smallText: {
    color: "#5A724A",
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
    fontFamily:"ZalandoSansExpanded-VariableFont_wght"
  },
  Text: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5A724A",
    textAlign: "center",
    fontFamily:"ZalandoSansExpanded-VariableFont_wght"
  },
  TextContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center",
     gap:5,
     paddingLeft:7,
 
  },
  Card: {
    width: 102,
    height: 120,
    borderRadius: 18,
    backgroundColor: "rgba(87, 145, 48, 0.45)",
    marginRight: 12,
    alignItems:"center",
     shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    padding:2,
    gap:3,
    justifyContent:"center"
  }
});

export default Cards