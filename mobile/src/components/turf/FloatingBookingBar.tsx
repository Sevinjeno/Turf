import { View, Text, TouchableOpacity } from "react-native";
import { SelectedSlot } from "../../types/bookings";

type Props = {
  selectedSlot: SelectedSlot;
  price: number;
  onBook: () => void;
};

export default function FloatingBookingBar({
  selectedSlot,
  price,
  onBook,
}: Props) {
  if (!selectedSlot.start || !selectedSlot.end) return null;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
      }}
    >
      <Text>
        {selectedSlot.start.time} - {selectedSlot.end.time}
      </Text>

      <TouchableOpacity
        onPress={onBook}
        style={{
          marginTop: 10,
          backgroundColor: "#4CAF50",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Book ₹{price}
        </Text>
      </TouchableOpacity>
    </View>
  );
}