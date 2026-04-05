import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from 'react';
import { RootParamsList } from '../App';
import axios  from 'axios';
import HeroSection from './components/HeroSection';
import WorlFlow from './components/WorlFlow';
import Cards from './components/Cards';
import { AuthContextProvider } from '../context/Auth';
import AllProducts from './fetpinnats';


type HomeProps = NativeStackScreenProps<RootParamsList, "Home">

const Home = ({ navigation }: HomeProps) => {
  return (
  <AuthContextProvider>
      <ScrollView>
      <View style={{ flex: 1, backgroundColor: "#e6f2e6" }}>
      <HeroSection/>
      <WorlFlow/>
     <Cards/>
    </View>
    </ScrollView>
  </AuthContextProvider>
  )
}

export default Home;
