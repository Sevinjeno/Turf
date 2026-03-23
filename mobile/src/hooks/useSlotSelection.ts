import dayjs from "dayjs";
import { SelectedSlot, Slot } from "../types/slots";

export const useSlotSelection = (
  slots: Slot[],
  selectedSlot: SelectedSlot | null,
  setSelectedSlot: (s: SelectedSlot) => void
) => {
  const handleSelect = (slot: Slot, courtId: string | null) => {
    if (!selectedSlot?.start) {
      setSelectedSlot({ start: slot, end: null });
      return;
    }

    const start = dayjs(`2000-01-01T${selectedSlot.start.time}`);
    const end = dayjs(`2000-01-01T${slot.time}`);

    if (end.isAfter(start)) {
      setSelectedSlot({ start: selectedSlot.start, end: slot });
    } else {
      setSelectedSlot({ start: slot, end: null });
    }
  };

  return { handleSelect };
};