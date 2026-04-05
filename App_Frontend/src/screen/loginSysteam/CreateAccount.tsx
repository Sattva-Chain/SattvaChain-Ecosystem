import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { launchCamera } from 'react-native-image-picker';
import localimage from "../../assets/Gemini_Generated_Image_giarzrgiarzrgiar.png"
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import axios from "axios"
import { LoginPramlitForStack } from "./LoginSystemApp";
import { useAuthContext } from "../../context/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../utils/Loader";
import AddProduct from "../AddProduct";
export interface LocationData {
    village: string
    taluka: string
    district: string
    state: string
    country: string
    postcode: String
    street: string
    housenumber: string
    formattedAddress: string

}
type createAcount = NativeStackScreenProps<LoginPramlitForStack, "CreateAccount">
const CreateAccount = ({ navigation }: createAcount) => {
    const { axiosInstance, AuthUser,setLocation,location } = useAuthContext()!
    const [name, setName] = useState("");
    const [loder, setLoder] = useState(false);
    const [number, SetNumber] = useState("");
    const [image, setimage] = useState(localimage)
    const [latitudes, setlatitude] = useState<number>()
    const [longitudes, setlongitude] = useState<number>()
    const [setimages, setUpdatedImage] = useState<boolean>(false)
    const getLocation = () => {
        Geolocation.getCurrentPosition((info) => {
            const { latitude, longitude } = info.coords
            setlatitude(latitude)
            setlongitude(longitude)
        }
        );
    }
    const createAcount = async () => {
        try {
            setLoder(true)
            const { data } = await axiosInstance.post("/createAccount", { name, number, location, image }); // change URL if needed
            if (data.success) {
                Alert.alert(`${data.msg}`)
                await AsyncStorage.setItem("Token", data.tokens)
                AuthUser();
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                })
            } else {
                Alert.alert(`${data.msg}`)
                 setLoder(false)
            }

        } catch (error) {
            Alert.alert("Please on Your Internet!")
            console.log(error)
             setLoder(false)
        }
    };
    const AcuurateLocationnfinsder = async () => {
        try {
            if (latitudes && longitudes) {
                try {
                    const { data } = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitudes}&lon=${longitudes}&apiKey=e3e209f0be4f4467b5feb5cdf9f6a6d0`
                    );
                    const locationData = data?.features[0].properties;
                    // console.log(locationData)
                    const detailedLocation = {
                        village: locationData.village || locationData.district || "",
                        taluka: locationData.district || locationData.county || "",
                        district: locationData.county || "",
                        state: locationData.state || "",
                        country: locationData.country || "",
                        postcode: locationData.postcode || "",
                        city: locationData.city || "",
                        street: locationData.street || "",
                        housenumber: locationData.housenumber || "",
                        formattedAddress: locationData.formatted || ""
                    };
                    setLocation(detailedLocation);
                } catch (error) {
                    console.error('Error fetching location:', error);
                    Alert.alert('Failed to fetch location');
                }
            } else {
                Alert.alert('Please provide location before creating account');
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLocation()
        console.log(location)
        if (latitudes && longitudes) {
            AcuurateLocationnfinsder()
        }
        console.log("location",location)
    }, [latitudes])
    const handleCreateAccount = () => {
        if (!name || !number || !location || !setUpdatedImage) {
            return Alert.alert("Please fill  All Details before Submit the from")
        } else {
            console.log(name, number, location, image)
            createAcount()
            setimage(localimage)
        }
    };
    interface cameraDetails {
        mediaType: string,
        includeBase64: boolean,
        maxHeight: number,
        maxWidth: number
    }
    const openImagePicker = () => {
        const options: cameraDetails = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image picker error: ', response.errorCode);
            } else if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                if (typeof imageUri === "string") {
                    setimage({ uri: imageUri }); // always use { uri: string } format
                    setUpdatedImage(true)
                }
            }
        });
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                let imageUri = response.assets?.[0]?.uri;
                if (typeof imageUri === "string") {
                    setimage({ uri: imageUri })
                    setUpdatedImage(true)
                }
                setimage(imageUri);
                setUpdatedImage(true)
            }
        });
    }
    const hnadlepres = () => {
        Alert.alert(
            'choose an Option',
            'Do You Want to Take a Photo or Choose From Gallery',
            [
                {
                    text: "Teke a photo",
                    onPress: handleCameraLaunch
                },
                {
                    text: "Choose from Gallery",
                    onPress: openImagePicker
                },
                {
                    text: "Cancel",
                    style: "cancel"
                },

            ],
            { cancelable: true }
        )
    }
  
    return (
        <View style={styles.mainContainer}>
          
            <StatusBar backgroundColor="#5A724A" barStyle="light-content" />
            <View >
                <Image source={require("../../assets/Gemini_Generated_Image_44ti8q44ti8q44ti-removebg-preview.png")} style={styles.imagLogo} />
            </View>
            <Text style={styles.title}>SattvaChain</Text>
            <Text style={styles.subtitle}>Create your account</Text>
            <Text>
            </Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={number}
                    onChangeText={SetNumber}
                />
                <View style={styles.impData}>


                    <Image source={typeof image === "string" ? { uri: image } : image} style={styles.image} />
                    <TouchableOpacity style={styles.button2} onPress={hnadlepres} >
                        <Icon name="camera" color={"white"} size={15} />
                        <Text style={styles.impdatabuttonText}>Farmer Photo</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                    <Text style={styles.buttonText}>


                        {
                            loder ? <Loader/>:"Create Account"
                        }
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.locationDiv}>
                <View style={styles.textforhederline}>
                    <Icon name='map-marker-alt' style={styles.Icons} />
                    <Text style={styles.locationTitle}>Your Location</Text>
                </View>
                {location ? (
                    <Text style={styles.divLocationText}>
                        <Text style={styles.label}>Village: </Text>{location.village}{"\n"}
                        <Text style={styles.label}>Taluka: </Text>{location.taluka}{"\n"}
                        <Text style={styles.label}>District: </Text>{location.district}{"\n"}
                        <Text style={styles.label}>State: </Text>{location.state}{"\n"}
                        <Text style={styles.label}>Country: </Text>{location.country}{"\n"}
                        <Text style={styles.label}>Postcode: </Text>{location.postcode}
                    </Text>
                ) : null}
            </View>


            <TouchableOpacity>
                <Text style={styles.loginLink}>
                    Already have an account? <Text style={styles.loginText} onPress={() => navigation.navigate("LoginUsingFarmerId")}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imagLogo: {
        width: 105,
        height: 55,
    },
    textforhederline: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        backgroundColor: "#2E7D32", // 🌿 herbal green
        marginBottom: 5,
        width: 140,
        borderRadius: 10,
        padding: 5
    },
    Icons: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    locationTitle: {
        fontSize: 14,
        color: "#FFFFFF",
        fontFamily: "ZalandoSansExpanded-VariableFont_wght"
    },
    locationDiv: {
        width: "100%",
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
    },
    divLocationText: {
        fontSize: 13,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        color: "#333",
        lineHeight: 20,
    },
    label: {
        color: "#444",
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
        textDecorationLine: "underline"
    },
    image: {
        height: 70,
        width: 87,
        borderRadius: 50
    },
    button2: {
        backgroundColor: "#2E7D32", // 🌿 herbal button
        padding: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        gap: 5
    },
    impdatabuttonText: {
        color: "white",
        fontSize: 15,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    impData: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        padding: 5
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#e6f2e6", // soft herbal background
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: "#2E7D32", // 🌿 herbal title
        marginBottom: 5,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#fafafa",
        marginBottom: 15,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    button: {
        backgroundColor: "#2E7D32", // 🌿 herbal button
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    loginLink: {
        fontSize: 14,
        color: "#333",
        marginTop: 15,
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
    loginText: {
        color: "#2E7D32", // 🌿 herbal link text
        fontFamily: "ZalandoSansExpanded-VariableFont_wght",
    },
});


export default CreateAccount;
