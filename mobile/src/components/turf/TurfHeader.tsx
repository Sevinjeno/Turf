import { View, Text, Image, StyleSheet } from "react-native";

export default function TurfHeader({ turf }) {
  return (
    <View>
      <Text style={styles.title}>Book Your Slot</Text>

      <Image source={turf.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{turf.name}</Text>
        <Text style={styles.location}>{turf.location}</Text>
        <Text style={styles.price}>₹{turf.price}/hr</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", padding: 16 },
  image: { width: "100%", height: 250 },
  info: { padding: 16, backgroundColor: "#fff" },
  name: { fontSize: 20, fontWeight: "bold" },
  location: { color: "#666", marginTop: 4 },
  price: { marginTop: 6, fontWeight: "bold" },
});