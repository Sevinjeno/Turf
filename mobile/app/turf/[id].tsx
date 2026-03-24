import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import dayjs from "dayjs";

// Components
import TurfHeader from "../../src/components/turf/TurfHeader";
import DateSelector from "../../src/components/turf/DateSelector";
import CourtSelector from "../../src/components/turf/CourtSelector";
import TimeSlotGrid from "../../src/components/turf/TimeSlotGrid";
import BookingSummary from "../../src/components/turf/BookingSummary";
import PricePreview from "../../src/components/turf/PricePreview";

// Hooks
import { useBookingPreview } from "../../src/hooks/useBookingPreview";

// Mock Data
import { turfs } from "../../src/data/turf";

/* ---------------- TYPES ---------------- */

type Slot = {
  time: string;
  status: "available" | "booked";
};

type SelectedSlot = {
  start: Slot | null;
  end: Slot | null;
};

// type UseBookingPreviewProps = {
//   selectedSlot: SelectedSlot;
//   selectedCourt: string | null;
//   selectedDate: string;
//   turfId: string; // ✅ required
// };

/* ---------------- SCREEN ---------------- */

export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams();

  const turf = turfs.find((t) => t.id === String(id));

  /* ---------------- STATE ---------------- */

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>({
    start: null,
    end: null,
  });

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

  /* ---------------- SLOT LOGIC ---------------- */

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

    // reset if both selected
    setSelectedSlot({ start: slot, end: null });
  };

  /* ---------------- BOOKING ---------------- */

  const handleBooking = () => {
    console.log("BOOKING DATA:", {
      turfId: id,
      date: selectedDate,
      start: selectedSlot.start?.time,
      end: selectedSlot.end?.time,
      court: selectedCourt,
    });
  };

  /* ---------------- PRICE PREVIEW HOOK ---------------- */

const { pricePreview, priceLoading } = useBookingPreview({
  selectedSlot,
  selectedCourt,
  selectedDate,
  turfId: String(id),
});

  if (!turf) return null;

  /* ---------------- UI ---------------- */

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TurfHeader turf={turf} />

      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <CourtSelector
        courts={courts}
        selectedCourt={selectedCourt}
        setSelectedCourt={setSelectedCourt}
      />

      <TimeSlotGrid
        slots={slots}
  selectedSlot={selectedSlot}
  setSelectedSlot={setSelectedSlot}
  selectedCourt={selectedCourt}
        handleSelect={handleSelect}
      />

      <PricePreview price ={pricePreview} loading={priceLoading} />

      <BookingSummary
        selectedSlot={selectedSlot}
        selectedCourt={selectedCourt}
        onBook={handleBooking}
      />
    </ScrollView>
  );
}