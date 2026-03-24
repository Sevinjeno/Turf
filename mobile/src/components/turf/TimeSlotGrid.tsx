import React, { useMemo } from "react";
import { View, FlatList, Text, Alert } from "react-native";
import SlotItem from "./SlotItem";
import { Slot, SelectedSlot } from "../../types/slots";

// 🔹 Props
type TimeSlotGridProps = {
  slots: Slot[];
  selectedSlot: SelectedSlot | null;
  setSelectedSlot: (slot: SelectedSlot) => void;
  selectedCourt: string | null;
   handleSelect: (slot: Slot) => void;
};

// 🔹 Convert time → minutes
const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export default function TimeSlotGrid({
  slots,
  selectedSlot,
  setSelectedSlot,
  selectedCourt,
}: TimeSlotGridProps) {
  // 🔹 Create slot map (time → slot)
  const slotMap = useMemo(() => {
    const map = new Map<number, Slot>();
    slots.forEach((slot) => {
      map.set(toMinutes(slot.time), slot);
    });
    return map;
  }, [slots]);

  // 🔹 Check consecutive slots (robust)
  const isConsecutiveAvailable = (
    startTime: string,
    endTime: string
  ): boolean => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (end <= start) return false;

    for (let t = start; t <= end; t += 30) {
      // 👈 adjust if slot duration is different
      const slot = slotMap.get(t);

      if (!slot || slot.status !== "available") {
        return false;
      }
    }

    return true;
  };

  // 🔹 Handle selection
const handleSelect = (slot: Slot) => {
  const selectedStart = selectedSlot?.start;
  const selectedEnd = selectedSlot?.end;

  // ✅ CASE 1: Nothing selected → set start
  if (!selectedStart) {
    setSelectedSlot({
      start: slot,
      end: null,
      courtId: Number(selectedCourt),
    });
    return;
  }

  // ✅ CASE 2: Same slot clicked again → UNSELECT
  if (
    selectedStart.time === slot.time &&
    !selectedEnd
  ) {
    setSelectedSlot({
  start: null,
  end: null,
  courtId: undefined,
}); // 👈 FIX (clear selection)
    return;
  }

  const startMin = toMinutes(selectedStart.time);
  const currentMin = toMinutes(slot.time);

  // ✅ CASE 3: Clicking earlier slot → reset start
  if (currentMin < startMin) {
    setSelectedSlot({
      start: slot,
      end: null,
      courtId: Number(selectedCourt),
    });
    return;
  }

  // ✅ CASE 4: Same slot but range exists → reset
  if (selectedStart.time === slot.time && selectedEnd) {
    setSelectedSlot({
      start: slot,
      end: null,
      courtId: Number(selectedCourt),
    });
    return;
  }

  // ✅ CASE 5: Select range (forward only)
  if (!isConsecutiveAvailable(selectedStart.time, slot.time)) {
    Alert.alert("Invalid Selection", "Only consecutive slots allowed");
    return;
  }

  setSelectedSlot({
    start: selectedStart,
    end: slot,
    courtId: Number(selectedCourt),
  });
};

  // 🔹 Check if slot is selected
  const isSlotInRange = (slot: Slot): boolean => {
    if (!selectedSlot?.start) return false;

    const startMin = toMinutes(selectedSlot.start.time);
    const endMin = selectedSlot.end
      ? toMinutes(selectedSlot.end.time)
      : startMin;

    const current = toMinutes(slot.time);

    return current >= startMin && current <= endMin;
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
            isSelected={isSlotInRange(item)}
            onPress={() => handleSelect(item)}
          />
        )}
      />
    </View>
  );
}