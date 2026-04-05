import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootParamsList, stackRootList } from '../App'
import AllProducts from './fetpinnats'

type DeatilsProps = NativeStackScreenProps<RootParamsList, "Deatils">

const Deatils = ({ navigation }: DeatilsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Product Details</Text>
      <Text style={styles.subtitle}>
        Here you can see the details about the selected product.
      </Text>
    <AllProducts/>
    </View>
  )
}

export default Deatils

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    color: "#333",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  
  },
  button: {
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",

  },
})
