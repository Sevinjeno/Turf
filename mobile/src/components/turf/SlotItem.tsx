import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Slot } from "../../types/slots"; // 👈 same place as TimeSlotGrid

// 🔹 Props type
type SlotItemProps = {
  item: Slot;
  isBooked: boolean;
  isSelected: boolean;
  onPress: () => void;
};

export default function SlotItem({
  item,
  isBooked,
  isSelected,
  onPress,
}: SlotItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isBooked && styles.booked,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
      disabled={isBooked} // 🚫 prevent clicking booked slots
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isBooked && styles.bookedText,
          isSelected && styles.selectedText,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },

  selected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },

  booked: {
    backgroundColor: "#eee",
    borderColor: "#ddd",
  },

  text: {
    fontSize: 14,
    color: "#333",
  },

  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },

  bookedText: {
    color: "#999",
    textDecorationLine: "line-through",
  },
});