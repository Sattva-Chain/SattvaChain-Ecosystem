import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack"
import { stackRootList } from '../App';
import React from 'react';
type  settlingprop = NativeStackScreenProps<stackRootList,"SettingStack">
const Setting = ({ navigation }:settlingprop) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.option} >
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} >
        <Text style={styles.optionText} onPress={()=>navigation.navigate("Languges")}>Language</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} >
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} >
        <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,

  },
  option: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 18,
    fontFamily:"ZalandoSansExpanded-VariableFont_wght"
  }
});

export default Setting;
