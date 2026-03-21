import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { turfs } from "../../src/data/turf"
export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams();

  const turf = turfs.find((t) => t.id === String(id));

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 🔥 Mock slots
  const slots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  if (!turf) {
    return (
      <View style={styles.center}>
        <Text>Turf not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🖼️ Turf Image */}
      <Image source={turf.image} style={styles.image} />

      {/* 📄 Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{turf.name}</Text>
        <Text style={styles.location}>{turf.location}</Text>
        <Text style={styles.price}>₹{turf.price}/hr</Text>
      </View>

      {/* ⏰ Slot Selection */}
      <View style={styles.slotContainer}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>

        <FlatList
          data={slots}
          numColumns={3}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.slot,
                selectedSlot === item && styles.selectedSlot,
              ]}
              onPress={() => setSelectedSlot(item)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === item && styles.selectedSlotText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 🔘 Book Button */}
      <TouchableOpacity
        style={[
          styles.button,
          !selectedSlot && styles.disabledButton,
        ]}
        disabled={!selectedSlot}
        onPress={() => {
          console.log("Booking:", turf.name, selectedSlot);
        }}
      >
        <Text style={styles.buttonText}>
          {selectedSlot ? "Book Now" : "Select Slot"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 250,
  },

  info: {
    padding: 16,
    backgroundColor: "#fff",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  location: {
    marginTop: 6,
    color: "#666",
  },

  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
  },

  slotContainer: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  slot: {
    flex: 1,
    margin: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  selectedSlot: {
    backgroundColor: "#111",
  },

  slotText: {
    color: "#333",
  },

  selectedSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },

  button: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#aaa",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});