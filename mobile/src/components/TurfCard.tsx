import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function TurfCard({ turf, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={turf.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{turf.name}</Text>
        <Text style={styles.location}>{turf.location}</Text>
        <Text style={styles.price}>₹{turf.price}/hr</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  location: {
    color: "#666",
    marginTop: 4,
  },
  price: {
    marginTop: 6,
    fontWeight: "bold",
  },
});