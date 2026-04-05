import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootParamsList } from '../App'
import { useAuthContext } from '../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

type UserProps = NativeStackScreenProps<RootParamsList, "User">

const User = ({ navigation }: UserProps) => {
  const { User ,AuthUser} = useAuthContext()

  const userDetails = {
    name: "Kiran Rathod",
    address: "123, Greenfield Colony, Pune, India",
    phone: "+91 7774025744",
    deviceName: "IoT Device X1",
    farmerID: "FMR-2025-01",
    network: "4G LTE",
    profileImage: "https://i.pravatar.cc/150?img=12" // dummy image
  }
  const logout = async()=>{
   await AsyncStorage.removeItem("Token")
   AuthUser()
     navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }], // or 'Login' if you have a login screen
    });
  }
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() }
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: userDetails.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.cardItem}><Text style={styles.label}>Farmer ID:</Text> {User?.CollectorId}</Text>
        <Text style={styles.subtitle}>Welcome to your profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <Text style={styles.cardItem}><Text style={styles.label}>Name:</Text> {userDetails.name}</Text>
        <Text style={styles.cardItem}><Text style={styles.label}>Address:</Text> 
        {User?.FarmerLocation.village},
        Taluka:{User?.FarmerLocation.taluka},
        district:{User?.FarmerLocation.district},
        city:{User?.FarmerLocation.city},
        state:{User?.FarmerLocation.state},
        country:{User?.FarmerLocation.country},
        pincode:{User?.FarmerLocation.postcode}
        </Text>
        <Text style={styles.cardItem}><Text style={styles.label}>Phone:</Text> {User?.FarmerNumber}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: "#D1C4E9" }]}>
        <Text style={styles.cardTitle}>Device Info</Text>
        <Text style={styles.cardItem}><Text style={styles.label}>Device Name:</Text> {userDetails.deviceName}</Text>
        <Text style={styles.cardItem}><Text style={styles.label}>Network:</Text> {userDetails.network}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}> Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default User

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  card: {
    backgroundColor: "#BBDEFB",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
  
    marginBottom: 15,
    fontWeight:"700",
    fontFamily: "Outfit-VariableFont_wght",
    color: "#3F51B5",
  },
  cardItem: {
    fontSize: 13,
    marginBottom: 8,
    color: "#333",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  label: {
    fontWeight: "600",
    color: "#000",
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  logoutButton: {
    backgroundColor: "#F44336",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
   
      fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  
  },
})
