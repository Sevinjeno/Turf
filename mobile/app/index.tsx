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
import dayjs from "dayjs";
import { turfs } from "../src/data/turf";

/* ---------------- TYPES ---------------- */

type Slot = {
  time: string;
  status: "available" | "booked";
};

type SelectedSlot = {
  start: Slot | null;
  end: Slot | null;
};

/* ---------------- SCREEN ---------------- */

export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams();

  const turf = turfs.find((t) => t.id === String(id));

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>({
    start: null,
    end: null,
  });

  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

  /* ---------------- MOCK DATA ---------------- */

  const courts = [
    { id: "1", name: "Court 1" },
    { id: "2", name: "Court 2" },
  ];

  const slots: Slot[] = [
    { time: "06:00", status: "available" },
    { time: "07:00", status: "available" },
    { time: "08:00", status: "booked" },
    { time: "09:00", status: "available" },
    { time: "17:00", status: "available" },
    { time: "18:00", status: "available" },
    { time: "19:00", status: "available" },
  ];

  /* ---------------- LOGIC ---------------- */

  const handleSelect = (slot: Slot) => {
    if (!selectedSlot.start) {
      setSelectedSlot({ start: slot, end: null });
      return;
    }

    if (!selectedSlot.end) {
      const startIndex = slots.findIndex(
        (s) => s.time === selectedSlot.start?.time
      );
      const endIndex = slots.findIndex((s) => s.time === slot.time);

      if (endIndex > startIndex) {
        setSelectedSlot({
          start: selectedSlot.start,
          end: slot,
        });
      } else {
        setSelectedSlot({ start: slot, end: null });
      }
      return;
    }

    // reset
    setSelectedSlot({ start: slot, end: null });
  };

  const isSlotSelected = (slot: Slot) => {
    if (!selectedSlot.start) return false;

    if (!selectedSlot.end) {
      return selectedSlot.start.time === slot.time;
    }

    return (
      slot.time >= selectedSlot.start.time &&
      slot.time <= selectedSlot.end.time
    );
  };

  /* ---------------- UI ---------------- */

  if (!turf) {
    return (
      <View style={styles.center}>
        <Text>Turf not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🖼️ Image */}
      <Image source={turf.image} style={styles.image} />

      {/* 📄 Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{turf.name}</Text>
        <Text style={styles.location}>{turf.location}</Text>
        <Text style={styles.price}>₹{turf.price}/hr</Text>
      </View>

      {/* 🏟️ Courts */}
      <View style={styles.courtContainer}>
        <Text style={styles.sectionTitle}>Select Court</Text>
        <View style={styles.courtRow}>
          {courts.map((court) => (
            <TouchableOpacity
              key={court.id}
              onPress={() => setSelectedCourt(court.id)}
              style={[
                styles.court,
                selectedCourt === court.id && styles.selectedCourt,
              ]}
            >
              <Text
                style={{
                  color:
                    selectedCourt === court.id ? "#fff" : "#000",
                }}
              >
                {court.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ⏰ Slots */}
      <View style={styles.slotContainer}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>

        <FlatList
          data={slots}
          numColumns={3}
          keyExtractor={(item) => item.time}
          renderItem={({ item }) => {
            const isBooked = item.status === "booked";
            const isSelected = isSlotSelected(item);

            return (
              <TouchableOpacity
                disabled={isBooked}
                style={[
                  styles.slot,
                  isSelected && styles.selectedSlot,
                  isBooked && styles.bookedSlot,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.selectedSlotText,
                  ]}
                >
                  {dayjs(`2000-01-01T${item.time}`).format(
                    "h:mm A"
                  )}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 📊 Selected Info */}
      <View style={styles.summary}>
        <Text>
          {selectedSlot.start
            ? `Start: ${selectedSlot.start.time}`
            : "Select start time"}
        </Text>
        {selectedSlot.end && (
          <Text>End: {selectedSlot.end.time}</Text>
        )}
        {selectedCourt && <Text>Court: {selectedCourt}</Text>}
      </View>

      {/* 🔘 Button */}
      <TouchableOpacity
        disabled={!selectedSlot.start || !selectedSlot.end || !selectedCourt}
        style={[
          styles.button,
          (!selectedSlot.start ||
            !selectedSlot.end ||
            !selectedCourt) &&
            styles.disabledButton,
        ]}
        onPress={() => {
          console.log("Booking:", {
            turf: turf.name,
            start: selectedSlot.start?.time,
            end: selectedSlot.end?.time,
            court: selectedCourt,
          });
        }}
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 250 },

  info: { padding: 16, backgroundColor: "#fff" },

  name: { fontSize: 22, fontWeight: "bold" },

  location: { marginTop: 6, color: "#666" },

  price: { marginTop: 8, fontSize: 18, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  courtContainer: { padding: 16 },

  courtRow: { flexDirection: "row" },

  court: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 8,
  },

  selectedCourt: {
    backgroundColor: "#111",
  },

  slotContainer: { padding: 16 },

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

  selectedSlot: { backgroundColor: "#111" },

  bookedSlot: { backgroundColor: "#ff4d4d" },

  slotText: { color: "#333" },

  selectedSlotText: { color: "#fff", fontWeight: "bold" },

  summary: { paddingHorizontal: 16 },

  button: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },

  disabledButton: { backgroundColor: "#aaa" },

  buttonText: { color: "#fff", fontWeight: "bold" },
});