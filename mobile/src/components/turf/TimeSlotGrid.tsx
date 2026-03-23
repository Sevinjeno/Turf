import { View, FlatList, Text } from "react-native";
import SlotItem from "./SlotItem";

export default function TimeSlotGrid({
  slots,
  selectedSlot,
  handleSelect,
}) {
  const isSelected = (slot) => {
    if (!selectedSlot.start) return false;

    if (!selectedSlot.end) {
      return selectedSlot.start.time === slot.time;
    }

    return (
      slot.time >= selectedSlot.start.time &&
      slot.time <= selectedSlot.end.time
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Select Time Slot
      </Text>

      <FlatList
        data={slots}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <SlotItem
            item={item}
            isBooked={item.status === "booked"}
            isSelected={isSelected(item)}
            onPress={() => handleSelect(item)}
          />
        )}
      />
    </View>
  );
}