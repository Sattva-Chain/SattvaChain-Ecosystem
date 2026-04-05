import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import CreateAccount from './CreateAccount'
import LoginUsingFarmerId from './LoginUsingFarmerId'
import { AuthContextProvider, useAuthContext } from '../../context/Auth'
export type LoginPramlitForStack = {
     Home: undefined;
    CreateAccount:undefined,
    LoginUsingFarmerId:undefined
    
}
const  stack  =  createNativeStackNavigator<LoginPramlitForStack>()
const LoginSystemApp = () => {
  const {User,AuthUser} = useAuthContext()!
  useEffect(()=>{
    AuthUser()
  },[])
  return (
   <NavigationContainer>
    <AuthContextProvider>
      <stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={`${User ? "LoginUsingFarmerId":"CreateAccount"}`}>
    <stack.Screen name='CreateAccount' component={CreateAccount} />
    <stack.Screen name='LoginUsingFarmerId' component={LoginUsingFarmerId} />
   </stack.Navigator>
    </AuthContextProvider>
   </NavigationContainer>
  )
}

export default LoginSystemApp