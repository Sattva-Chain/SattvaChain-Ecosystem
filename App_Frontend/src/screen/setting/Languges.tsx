import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack"
import React, { useState } from 'react';

import { stackRootList } from '../../App';

type  langProsp = NativeStackScreenProps<stackRootList,"Languges">
const Languages = ({navigation}:langProsp) => {
    const [selected, setSelected] = useState<string>("");
    const languages = ['English', 'Hindi', 'Marathi'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Language</Text>

      {languages.map((lang, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selected === lang && styles.selectedButton
          ]}
          onPress={() => {setSelected(lang);navigation.navigate("MainTabs")} }
        >
          <Text style={[
            styles.buttonText,
            selected === lang && styles.selectedButtonText
          ]}>
            {lang}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20
  },
  title: {
    fontSize: 25,
    marginBottom: 40,
    fontWeight: '600',
    color: '#333',
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  button: {
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  selectedButton: {
    backgroundColor: '#2d6935ff',
    borderColor: '#436436ff'
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: '600',
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  }
});

export default Languages;
