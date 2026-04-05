import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { LoginPramlitForStack } from './LoginSystemApp';
import { useAuthContext } from '../../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stackRootList } from '../../App';
type LoginProps =
    NativeStackScreenProps<LoginPramlitForStack, "LoginUsingFarmerId">



const LoginUsingFarmerId = ({ navigation }: LoginProps) => {
    const { axiosInstance, AuthUser, setUser } = useAuthContext()
    const [farmerId, setFarmerId] = useState('');
    const handleSubmit = async () => {
        if (farmerId.trim() === '') {
            Alert.alert('Error', 'Please enter your Farmer ID');
            return;
        }
        const { data } = await axiosInstance.post("/Login", { Id: farmerId })
        if (data.sucess) {
            await AsyncStorage.setItem("Token", data.tokens)
            setUser(data.datas)
            AuthUser()
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            Alert.alert('Success', `Farmer ID: ${farmerId} submitted`);
        } else {
            Alert.alert(`${data.msg}`);

        }
    };

    const handleForgotId = () => {
        Alert.alert('Info', 'Redirect to Forgot Customer ID');
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
                <Image source={require("../../assets/Gemini_Generated_Image_44ti8q44ti8q44ti-removebg-preview.png")} style={styles.imagLogo} />
            </View>
            <Text style={styles.title}>SattvaChain</Text>
            <Text style={styles.subtitle}>Login Using Farmer ID</Text>

            <View style={styles.inputCard}>
                <Icon name="badge" size={24} color="#5A724A" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Farmer ID"
                    value={farmerId}
                    onChangeText={setFarmerId}
                    keyboardType="default"
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotId}>
                {/* <Text style={styles.forgotText}>Forgot Customer ID?</Text> */}
                <Text style={styles.text} >Don't Have Account ?<Text style={styles.forgotText} onPress={() => navigation.navigate("CreateAccount")}>CreateAcount</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginUsingFarmerId;

const styles = StyleSheet.create({
    text: {
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        marginLeft: 5
    },
    imagLogo: {
        width: 105,
        height: 55,
    },
    container: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        backgroundColor: '#e6f2e6', // soft greenish background
    },
    title: {
        fontSize: 28,
        color: "#2E7D32",  // 🌿 herbal green
        marginBottom: 5,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: "#3b3b3b",
        marginBottom: 30,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        textAlign: 'center',
    },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 25,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        height: 50,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        fontSize: 15,
    },
    submitButton: {
        height: 50,
        backgroundColor: '#2E7D32', // 🌿 herbal button
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    forgotText: {
        color: '#2E7D32',  // 🌿 herbal link
        textAlign: 'center',
        fontSize: 14,
        marginLeft: 5,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        textDecorationLine: 'underline',
    },
});

