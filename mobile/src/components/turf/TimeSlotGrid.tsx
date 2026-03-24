import { View, FlatList, Alert } from "react-native";
import dayjs from "dayjs";
import { Slot, SelectedSlot } from "../../types/bookings";
import SlotItem from "./SlotItem";

type Props = {
  slots: Slot[];
  selectedSlot: SelectedSlot;
  setSelectedSlot: (s: SelectedSlot) => void;
  selectedDate: string;
  minDuration: number;
};

export default function TimeSlotGrid({
  slots,
  selectedSlot,
  setSelectedSlot,
  selectedDate,
  minDuration,
}: Props) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isPast = (time: string) =>
    dayjs(`${selectedDate} ${time}`).isBefore(dayjs());

  const handleSelect = (slot: Slot) => {
    const start = selectedSlot.start;

    if (!start) return setSelectedSlot({ start: slot, end: null });

    const startMin = toMin(start.time);
    const currentMin = toMin(slot.time);

    if (currentMin < startMin)
      return setSelectedSlot({ start: slot, end: null });

    const diff = currentMin - startMin;

    if (diff < minDuration) {
      Alert.alert("Min booking not met");
      return;
    }

    setSelectedSlot({ start, end: slot });
  };

  const isSelected = (slot: Slot) => {
    if (!selectedSlot.start) return false;

    const start = toMin(selectedSlot.start.time);
    const end = selectedSlot.end
      ? toMin(selectedSlot.end.time)
      : start;

    const cur = toMin(slot.time);

    return cur >= start && cur <= end;
  };

  return (
    <View>
      <FlatList
        data={slots}
        numColumns={3}
        keyExtractor={(i) => i.time}
        renderItem={({ item }) => (
          <SlotItem
            item={item}
            isSelected={isSelected(item)}
            isDisabled={
              item.status === "booked" || isPast(item.time)
            }
            onPress={() => handleSelect(item)}
          />
        )}
      />
    </View>
  );
}