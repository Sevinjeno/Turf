import { View, Text, TouchableOpacity } from "react-native";

type Slot = {
  time: string;
  status: "available" | "booked";
};

type SelectedSlot = {
  start: Slot | null;
  end: Slot | null;
};

type BookingSummaryProps = {
  selectedSlot: SelectedSlot;
  selectedCourt: string | null;
  onBook: () => void;
};

export default function BookingSummary({
  selectedSlot,
  selectedCourt,
  onBook,
}:BookingSummaryProps) {
  const disabled =
    !selectedSlot.start || !selectedSlot.end || !selectedCourt;

  return (
    <View style={{ padding: 16 }}>
      <Text>
        {selectedSlot.start
          ? `Start: ${selectedSlot.start.time}`
          : "Select start time"}
      </Text>

      {selectedSlot.end && (
        <Text>End: {selectedSlot.end.time}</Text>
      )}

      {selectedCourt && <Text>Court: {selectedCourt}</Text>}

      <TouchableOpacity
        disabled={disabled}
        onPress={onBook}
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 10,
          backgroundColor: disabled ? "#aaa" : "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}