import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView, Modal, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { launchCamera } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useAuthContext } from "../context/Auth";
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

interface ProductForm {
  productId: string;
  farmerId: string;
  productName: string;
  location: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
}

const plantSuggestions: Record<string, string> = {
  "Tulsi": "Ocimum sanctum",
  "Ashwagandha": "Withania somnifera",
  "Haldi": "Curcuma longa",
  "Brahmi": "Bacopa monnieri",
  "Pudina": "Mentha spicata",
  "Dhaniya": "Coriandrum sativum",
  "Methi": "Trigonella foenum-graecum",
  "Kadi Patta": "Murraya koenigii",
  "Adrak": "Zingiber officinale",
  "Neem": "Azadirachta indica"
};

const AddProduct = () => {
  const navigation = useNavigation<any>();
  const [images, setImages] = useState<string[]>([]);
  const [vedant, setVedant] = useState<{ temperature: number; humidity: number; soilMoisture: number } | null>(null);
  const { User, location, setLocation } = useAuthContext()!;
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Sending data pre-check to AI...");
  const [produtname, setprodutname] = useState("");

  const generateProductId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `P${randomLetter}${randomNumber}`;
  };

  const [form, setForm] = useState<ProductForm>({
    productId: generateProductId(),
    farmerId: User?.CollectorId || "",
    productName: "",
    location: `${location?.village} ,${location?.taluka},${location?.district}` || "",
    temperature: "",
    humidity: "",
    soilMoisture: "",
  });

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (key: keyof ProductForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleProductNameChange = (value: string) => {
    setprodutname(value);
    setForm({ ...form, productName: value });
    if (value.length > 0) {
      const suggestions = Object.keys(plantSuggestions).filter((plant) =>
        plant.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (plantName: string) => {
    setForm({ ...form, productName: plantName });
    setShowSuggestions(false);
  };

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        setLatitude(info.coords.latitude);
        setLongitude(info.coords.longitude);
      },
      (error) => Alert.alert("Location Error", error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const AccurateLocationFinder = async () => {
    try {
      if (latitude != null && longitude != null) {
        const { data } = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=e3e209f0be4f4467b5feb5cdf9f6a6d0`
        );
        const locationData = data?.features[0].properties;
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
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Failed to fetch location');
    }
  };

  useEffect(() => { getLocation(); }, []);
  useEffect(() => { if (latitude != null && longitude != null) AccurateLocationFinder(); }, [latitude, longitude]);
  useEffect(() => { if (location) setForm(prev => ({ ...prev, location: `${location.village}, ${location.taluka}, ${location.district}` })); }, [location]);

  const fetchVedantData = async () => {
    try {
      const { data } = await axios.get("https://esp32-nodeserver.onrender.com/data");
      setVedant(data);
      setForm((prev) => ({
        ...prev,
        temperature: String(data?.temperature),
        humidity: String(data?.humidity),
        soilMoisture: String(data?.soilMoisture),
      }));
    } catch (error) { console.log(error); }
  };
  useEffect(() => { fetchVedantData(); }, []);

  const handleCameraLaunch = () => {
    if (images.length >= 3) { Alert.alert("You can only upload 3 images"); return; }
    launchCamera({ mediaType: "photo", includeBase64: false, maxHeight: 2000, maxWidth: 2000 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0]?.uri;
        if (imageUri) setImages([...images, imageUri]);
      }
    });
  };

  // ✅ Updated handleSubmit with AI pre-check
  const handleSubmit = async () => {
    if (images.length !== 3) {
      Alert.alert("Validation Error", "Please upload exactly 3 images");
      return;
    }

    setLoading(true);
    setLoaderText("Running AI pre-check...");

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: images[0],
        name: "image.jpg",
        type: "image/jpeg"
      } as any);

      const geminiRes = await axios.post(
        "https://sattva-chain-processor.onrender.com/agent/identify-herb",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(geminiRes.data)

      const confidence = geminiRes.data?.confidence || 0;

      if (confidence < 0.8) {
        setLoading(false);
        Alert.alert("Herb Check Failed", "Confidence too low. Please recheck the herb.");
        return;
      }

      // 2️⃣ If confidence is OK, upload images to IPFS
      setLoaderText("Uploading images to IPFS...");

      const imageHashes: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const data = new FormData();
        data.append("file", {
          uri: images[i],
          name: `image${i + 1}.jpg`,
          type: "image/jpeg",
        } as any);

        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: "9ee892bfc12b953147be",
              pinata_secret_api_key:
                "c85fc4ba88949c3302c358f04734f9b51b2c971f1de682e0f90304eb6a8a01d3",
            },
          }
        );

        imageHashes.push(res.data.IpfsHash);
      }

      // 3️⃣ Upload JSON metadata to IPFS
      setLoaderText("Uploading metadata to IPFS...");

      const metadata = {
        ...form,
        farmerId: User?.CollectorId || "",
        images: imageHashes,
        type: "product",
      };

      const jsonRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataMetadata: { name: form.productName || "Product", keyvalues: { type: "product", farmerId: form.farmerId } },
          pinataOptions: { cidVersion: 1 },
          pinataContent: metadata,
        },
        {
          headers: {
            pinata_api_key: "9ee892bfc12b953147be",
            pinata_secret_api_key:
              "c85fc4ba88949c3302c358f04734f9b51b2c971f1de682e0f90304eb6a8a01d3",
          },
        }
      );

      setLoading(false);
      Alert.alert("Success ✅", `Product stored on IPFS\nID: ${jsonRes.data.IpfsHash}`);
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Error ❌", "Failed to store product on IPFS");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>🌿 Add Product</Text>

        {/* Product ID */}
        <View style={styles.inputLabelContainer}>
          <Icon name="barcode-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Product ID</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Product ID"
          value={form.productId}
          onChangeText={(text) => handleInputChange("productId", text)}
        />

        {/* Farmer ID */}
        <View style={styles.inputLabelContainer}>
          <Icon name="person-circle-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Farmer ID</Text>
        </View>
        <TextInput style={styles.input} placeholder="Farmer ID" value={form.farmerId} editable={false} />

        {/* Product Name */}
        <View style={styles.inputLabelContainer}>
          <Icon name="leaf-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Product Name</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={form.productName}
          onChangeText={handleProductNameChange}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ScrollView style={styles.suggestionBox}>
            {filteredSuggestions.map((item) => (
              <TouchableOpacity key={item} style={styles.suggestionItem} onPress={() => handleSuggestionSelect(item)}>
                <Text>{item} ({plantSuggestions[item]})</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Location */}
        <View style={styles.inputLabelContainer}>
          <Icon name="location-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Location</Text>
        </View>
        <TextInput style={styles.input} placeholder="Location" value={`${form.location}`} editable={false} />

        {/* Temperature */}
        <View style={styles.inputLabelContainer}>
          <Icon name="thermometer-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Temperature (°C)</Text>
        </View>
        <TextInput style={styles.input} placeholder="Temperature" value={form.temperature} editable={false} />

        {/* Humidity */}
        <View style={styles.inputLabelContainer}>
          <Icon name="water-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Humidity (%)</Text>
        </View>
        <TextInput style={styles.input} placeholder="Humidity" value={form.humidity} editable={false} />

        {/* Soil Moisture */}
        <View style={styles.inputLabelContainer}>
          <Icon name="leaf-outline" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Soil Moisture (%)</Text>
        </View>
        <TextInput style={styles.input} placeholder="Soil Moisture" value={form.soilMoisture} editable={false} />

        {/* Images */}
        <View style={styles.imageContainer}>
          {images.map((img, idx) => <Image key={idx} source={{ uri: img }} style={styles.image} />)}
        </View>

        {images.length > 0 && <Text style={styles.counterText}>{`${images.length}/3 images uploaded`}</Text>}

        {images.length < 3 && (
          <TouchableOpacity style={styles.imageButton} onPress={handleCameraLaunch}>
            <Icon name="camera-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
        )}

        {images.length === 3 && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save Product</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loaderText}>{loaderText}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9F5", fontFamily: "ZalandoSansExpanded-VariableFont_wght" },
  heading: { fontSize: 24, color: "#2E7D32", marginBottom: 20, textAlign: "center", fontFamily: "ZalandoSansExpanded-VariableFont_wght" },
  inputLabelContainer: { flexDirection: "row", alignItems: "center", marginTop: 10, fontFamily: "ZalandoSansExpanded-VariableFont_wght" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6, fontFamily: "ZalandoSansExpanded-VariableFont_wght" },
  input: { backgroundColor: "#fff", color: "#000", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: "#D0D8CC", fontFamily: "ZalandoSansExpanded-VariableFont_wght" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 15 },
  image: { width: 100, height: 100, borderRadius: 12, marginRight: 10, marginBottom: 10, borderWidth: 2, borderColor: "#5A724A" },
  counterText: { textAlign: "center", marginBottom: 10, fontSize: 14, color: "#5A724A" },
  imageButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#2E7D32", paddingVertical: 14, borderRadius: 12, justifyContent: "center", marginTop: 10 },
  submitButton: { backgroundColor: "#2E7D32", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  loaderContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  loaderBox: { backgroundColor: "#2C2C2C", padding: 25, borderRadius: 12, alignItems: "center" },
  loaderText: { color: "#fff", fontSize: 16, textAlign: "center", marginTop: 15 },
  suggestionBox: { backgroundColor: "#fff", borderColor: "#D0D8CC", borderWidth: 1, borderRadius: 8, maxHeight: 130 },
  suggestionItem: { padding: 10, borderBottomColor: "#D0D8CC", borderBottomWidth: 1 }
});

export default AddProduct;
