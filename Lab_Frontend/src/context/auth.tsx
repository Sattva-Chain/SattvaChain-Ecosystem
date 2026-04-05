import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { ABI } from "./Contarct";
import {ethers} from "ethers"
// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const axioseInstance = axios.create({
    baseURL:"https://bkdoflab.onrender.com"
  })
  // Fetch user data from backend
  const fetchUser = async () => {
    try {
      const res = await axioseInstance.get("/Auth", { withCredentials: true });
      if (res.data.success) {
        setUser(res.data?.userData);
        setSuccess(true);
      } else {
        setUser(null);
        setSuccess(false);
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
   const [contract, setcontract] = useState()
   const [account, setaccout] = useState()
  const conntecte = async () => {
    if (window.ethereum) {
      const account = await window.ethereum.request({ method: "eth_requestAccounts" })
      console.log("connectedAcount", account[0])
      setaccout(account[0])
    } else {
      alert("You need to install metamask")
    }
  }

  const contractAddres = "0xcb668058cc5435106816C4F81f8e0D7e24281EDC"
  useEffect(() => {
    const EtherConnecte = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddres, ABI, signer)
      setcontract(contract)
    }
    console.log(contract)
    EtherConnecte()
    conntecte()
  }, [])
  // Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    setSuccess(false);
    // Optionally, make a logout request to backend to clear cookie
    axios.post("https://bkdoflab.onrender.com/logout", {}, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, success, loading, fetchUser,axioseInstance, logout ,contract,account,conntecte}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = () => useContext(AuthContext);
