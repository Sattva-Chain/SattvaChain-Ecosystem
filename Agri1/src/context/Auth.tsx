import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationData } from "../screen/loginSysteam/CreateAccount";
type Ilocation = {
    village: string
    taluka: string,
    district: string,
    country: string,
    postcode: string,
    city: string,
    state: string
}
type IUser = {
    CollectorId: string,
    nameOfFarmer: string,
    FarmerNumber: number,
    FarmerLocation: Ilocation


} | null
interface AuthContextType {
    axiosInstance: AxiosInstance,
    User: IUser,
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
    AuthUser: () => void,
    location:LocationData | undefined,
    setLocation:React.Dispatch<React.SetStateAction<LocationData | undefined>>
    
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const axiosInstance = axios.create({
    baseURL: "https://farmerbackend-dev.onrender.com/api"
})

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [location, setLocation] = useState<LocationData | undefined>()
    const [User, setUser] = useState<IUser>(null)
    const AuthUser = async () => {
        try {
            const token = await AsyncStorage.getItem("Token")
            console.log(token)
            if (!token) return;
            const { data } = await axiosInstance.post("/UserAuth", { token })
            if (data.success) {
                setUser(data?.users)
            }
        } catch (error) {
            console.log("Auth error:", error);
        }
    }
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("Token");
            if (token) AuthUser();
        };

        checkAuth();
        const interval = setInterval(checkAuth, 10000); // repeat
        console.log(location)
        return () => clearInterval(interval);
    }, []);


    return (
        <AuthContext.Provider value={{ axiosInstance, User, setUser, AuthUser,location,setLocation }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};