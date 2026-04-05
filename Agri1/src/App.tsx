import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LocaleDirContext, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/FontAwesome5';
import splash from "react-native-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from "./screen/Home";
import User from "./screen/User";
import Details from "./screen/Deatils";
import Setting from "./screen/Setting";
import Languages from "./screen/setting/Languges";
import CreateAccount from "./screen/loginSysteam/CreateAccount";
import LoginUsingFarmerId from "./screen/loginSysteam/LoginUsingFarmerId";
import LoginSystemApp from "./screen/loginSysteam/LoginSystemApp";
import { AuthContextProvider, useAuthContext } from "./context/Auth";
import AddProduct from "./screen/AddProduct";

export type RootParamsList = {
  Home: undefined;
  Deatils: { product: number };
  User: undefined;
  ListProduct: undefined;
  LoginUsingFarmerId: undefined,
  AddProduct:undefined,
  SettingStack:undefined

};

export type stackRootList = {
  MainTabs: undefined,
  SettingStack: undefined
  Languges: undefined,
  LoginUsingFarmerId: undefined,
  Deatils: undefined

}
const Tab = createBottomTabNavigator<RootParamsList>();

const Stack = createNativeStackNavigator<stackRootList>();

const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingStack"
        component={Setting}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#5A724A" },
          headerTintColor: "#fff",
          title: "Settings",
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "ZalandoSansExpanded-VariableFont_wght",
          },
        }}
      />
    
      <Stack.Screen
        name="Languges"
        component={Languages}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#2E7D32" },
          headerTintColor: "#fff",
          title: "Languges",
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: "ZalandoSansExpanded-VariableFont_wght",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#2E7D32" },
      tabBarActiveTintColor: "#2E7D32",
      tabBarInactiveTintColor: "black",
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: "600",
        paddingBottom: 20,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        paddingTop: 5,
      },
      tabBarStyle: {
        height: 85,
        paddingBottom: 10,
        paddingTop: 15,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={({ navigation }) => ({
        title: "SattvaChain",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#2E7D32",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 80,
          shadowColor: "#000",
          elevation: 5,
        },
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Image
              source={require("../assets/1758283450971[1].png")}
              style={{ width: 29, height: 30, marginRight: 8 }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontFamily: "ZalandoSansExpanded-VariableFont_wght",
              }}
            >
              SattvaChain
            </Text>
          </View>
        ),
        tabBarIcon: ({ focused }) => (
          <Icon name="home" size={20} color={focused ? "#2E7D32" : "black"} solid />
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("SettingStack")}>
            <Icon name="cog" size={18} color="#fff" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
      })}
    />

    <Tab.Screen
      name="Deatils"
      component={Details}
      options={{

        headerStyle: {
          backgroundColor: "#2E7D32",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 80,
          shadowColor: "#000",
          elevation: 5,
        },
        headerTitleStyle: {
          color: "#fff",
          fontSize: 20,
          fontFamily: "ZalandoSansExpanded-VariableFont_wght",
          alignSelf: "center",
        },
        title: "Dashboard",
        tabBarIcon: ({ focused }) => (
          <Icon name="chart-line" size={20} color={focused ? '#2E7D32' : "black"} solid />
        ),
        headerRight: () => (
          <View style={styles.container}>
            <Text style={styles.Text}>Device Connected</Text>
            <Icon name="microchip" size={13} color="#2E7D32" style={{ marginRight: 15 }} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="User"
      component={User}
      options={{
        headerStyle: {
          backgroundColor: "#2E7D32",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 80,
          shadowColor: "#000",
          elevation: 5,
        },
        headerTitleStyle: {
          color: "#fff",
          fontSize: 20,
          fontFamily: "ZalandoSansExpanded-VariableFont_wght",
          alignSelf: "center",
        },
        title: "Profile",
        tabBarIcon: ({ focused }) => (
          <Icon name="user" size={20} color={focused ? '#2E7D32' : "black"} solid />
        ),
      }}
    />
    <Tab.Screen
      name="AddProduct"
      component={AddProduct}
      options={{
        headerStyle: {
          backgroundColor: "#2E7D32",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 80,
          shadowColor: "#000",
          elevation: 5,
        },
        headerTitleStyle: {
          color: "#fff",
          fontSize: 20,
          fontFamily: "ZalandoSansExpanded-VariableFont_wght",
          alignSelf: "center",
        },
        title: "Add",
        tabBarIcon: ({ focused }) => (
          <Icon name="leaf" size={20} color={focused ? '#5A724A' : "black"} solid />
        ),
      }}
    />
  </Tab.Navigator>
);
const App = () => {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
};
const AppContent = () => {
  const { User } = useAuthContext()!

  useEffect(() => {
    setTimeout(() => {
      splash.hide();
    }, 50);
  }, []);


  console.log(!!User);


  return (
    <AuthContextProvider>
      {
          User ? <NavigationContainer>
          <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="SettingStack" component={SettingStack} />
          </Stack.Navigator>
        </NavigationContainer> : <LoginSystemApp />
      }
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 8,
    marginRight: 10,
    borderRadius: 22,
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  Text: {
    color: "#89BF04",
    fontWeight: "600",
    fontSize: 11,
    fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
});

export default App;
