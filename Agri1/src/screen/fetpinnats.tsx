import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/Auth";

const AllProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {User,axiosInstance} = useAuthContext()
  
 useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/products/${User?.CollectorId}`);
      setProducts(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  fetchProducts();
}, [])

  if (loading)
    return <ActivityIndicator size="large" color="#5A724A" style={{ marginTop: 20 }} />;

  return (
    <ScrollView style={styles.container}>
      {products.map((prod, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.name}>{prod.productName}</Text>
          <Text style={styles.detail}>Farmer: {prod.farmerId}</Text>
          <Text style={styles.detail}>Location: {prod.location}</Text>
          <Text style={styles.detail}>Humidity: {prod.humidity}</Text>
          <Text style={styles.detail}>Soil Moisture: {prod.soilMoisture}</Text>
          <Text style={styles.detail}>Temperature: {prod.temperature}° c</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {prod.images.map((img: string, i: number) => (
              <Image
                key={i}
                source={{ uri: `https://emerald-lazy-moose-425.mypinata.cloud/ipfs/${img}` }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#F8F9F5" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
     fontFamily: "ZalandoSansExpanded-VariableFont_wght",
  },
  name: { fontSize: 18, fontWeight: "600", color: "#5A724A", fontFamily: "ZalandoSansExpanded-VariableFont_wght", },
  detail: { fontSize: 14, color: "#333", marginTop: 2, fontFamily: "ZalandoSansExpanded-VariableFont_wght", },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
});

export default AllProducts;
