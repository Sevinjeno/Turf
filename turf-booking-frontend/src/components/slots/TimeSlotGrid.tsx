import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { previewBooking } from "../../services/Bookings/Index";
import { useParams } from "react-router-dom";

dayjs.extend(isSameOrBefore);

interface Slot {
  courtId: number; // 👈 added court reference
  time: string;
  status: string;
}
interface PricePreview {
  basePrice: number;
  platformFee: number;
  totalAmount: number;
}

interface TimeSlotGridProps {
  slots: Slot[];
  selectedSlot: any;
  setSelectedSlot: (slot: any) => void;
  selectedDate: string;
  minDuration: number;
  handleBooking: () => void;
  selectedCourt: number | null; // 👈 new prop
  pricePreview: PricePreview | null;
   priceError:string | null;
   priceLoading:boolean;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlot,
  setSelectedSlot,
  selectedDate,
  minDuration,
  handleBooking,
  selectedCourt,
  pricePreview,
  priceLoading,
  priceError

}) => {
  const [activeTab, setActiveTab] = useState("Morning");
  const { id } = useParams();
  const formatTime = (time: string) =>
    dayjs(`2000-01-01T${time}`).format("h:mm A");

  function isConsecutiveAvailable(slots: any, startTime: any, endTime: any) {
    const startIndex = slots.findIndex((s) => s.time === startTime);
    const endIndex = slots.findIndex((s) => s.time === endTime);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return false;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      if (slots[i].status !== "available") {
        return false;
      }
    }
    return true;
  }

  const handleSelect = (slot: Slot) => {
    const selectedStart = selectedSlot?.start?.time;

    if (selectedStart === slot.time && !selectedSlot?.end) {
      setSelectedSlot({ start: null, end: null, courtId: selectedCourt });
      return;
    }

    if (!selectedSlot?.start) {
      setSelectedSlot({ start: slot, end: null, courtId: selectedCourt });
      return;
    }

    if (
      dayjs(`2000-01-01T${slot.time}`).isAfter(
        dayjs(`2000-01-01T${selectedSlot.start.time}`)
      )
    ) {
      if (!isConsecutiveAvailable(slots, selectedSlot.start.time, slot.time)) {
        alert("You can only book consecutive available slots!");
        return;
      }
      setSelectedSlot({
        start: selectedSlot.start,
        end: slot,
        courtId: selectedCourt,
      });
    } else {
      setSelectedSlot({ start: slot, end: null, courtId: selectedCourt });
    }
  };

  const isSlotInRange = (slot: Slot) => {
    const start = selectedSlot?.start;
    const end = selectedSlot?.end;
    if (!start || !start.time) return false;
    if (!end) return slot.time === start.time;

    const slotTime = dayjs(`2000-01-01T${slot.time}`);
    const startTime = dayjs(`2000-01-01T${start.time}`);
    const endTime = dayjs(`2000-01-01T${end.time}`);

    return (
      slotTime.isSame(startTime) ||
      (slotTime.isAfter(startTime) && slotTime.isSameOrBefore(endTime))
    );
  };

  const selectedDurationValid = useMemo(() => {
    const start = selectedSlot?.start;
    const end = selectedSlot?.end;

    if (!start || !end) return false;

    const startTime = dayjs(`2000-01-01T${start.time}`);
    const endTime = dayjs(`2000-01-01T${end.time}`);
    const diff = endTime.diff(startTime, "minute");

    return diff >= minDuration;
  }, [selectedSlot, minDuration]);

  // 👇 filter by court + time of day

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (selectedCourt && slot.courtId !== selectedCourt) return false;

      const hour = dayjs(`2000-01-01T${slot.time}`).hour();
      if (activeTab === "Morning") return hour >= 5 && hour < 12;
      if (activeTab === "Afternoon") return hour >= 12 && hour < 17;
      if (activeTab === "Evening") return hour >= 17;
      return true;
    });
  }, [slots, activeTab, selectedCourt]);


  // useEffect for PricePreview calling function to services here
  // useEffect(() => {
  //   const runPreview = async () => {
  //     if (!selectedSlot?.start || !selectedSlot?.end) {
  //       setPricePreview(null);
  //       return;
  //     }

  //     const startTime = dayjs(
  //       `${selectedDate}T${selectedSlot.start.time}`
  //     ).toISOString();

  //     const endTime = dayjs(
  //       `${selectedDate}T${selectedSlot.end.time}`
  //     ).toISOString();

  //     try {
  //       const preview = await previewBooking({
  //         turf_id: id,
  //         start_time: startTime,
  //         end_time: endTime,
  //         court_id: selectedCourt,
  //       });

  //       setPricePreview(preview);
  //     } catch (err) {
  //       setPricePreview(null);
  //     }
  //   };

  //   runPreview();
  // }, [selectedSlot, selectedDate, selectedCourt]);


const renderPreview = () => {
  debugger
  if(priceLoading){
    return(
      <div className="p-4 border rounded-lg bg-gray-50 animate-pulse">
        Calculating price…
      </div>
    )
  }
  if(priceError){
    return(
      <div className="mt-3 p-3 rounded-lg bg-red-100 border border-red-400">
        <p className="text-sm text-red-700 font-medium">
          ⚠️ {priceError}
        </p>
      </div>
    )
  }
  console.log("PricePreview",pricePreview)
   if (!pricePreview) return null;


  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <p className="text-sm text-gray-600">Price Breakdown</p>
      <p>Base: ₹{pricePreview.basePrice}</p>
      <p>Platform Fee: ₹{pricePreview.platformFee}</p>
      <p className="font-bold text-lg">
        Total: ₹{pricePreview.totalAmount}
      </p>
    </div>
  );
};

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full px-4">
      {/* Left Side – Slot Section */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center gap-4">
          {["Morning", "Afternoon", "Evening"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white border border-gray-400 hover:bg-blue-400/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filteredSlots.map((slot, i) => {
            const isBooked = slot.status === "booked";
            const selected = isSlotInRange(slot);

            return (
              <button
                key={i}
                disabled={isBooked}
                onClick={() => handleSelect(slot)}
                className={`text-xs px-3 py-1 rounded-lg transition min-w-[75px]
                  ${
                    isBooked
                      ? "bg-red-300/40 text-red-800 border border-red-500 cursor-not-allowed"
                      : selected
                      ? "bg-blue-500/70 text-black border border-blue-300 font-semibold"
                      : "bg-white/10 hover:bg-blue-400/30 text-black border border-gray-400"
                  }
                `}
              >
                {formatTime(slot.time)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side – Selected Info */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="p-4 border rounded-lg bg-gray-700 backdrop-blur-md">
          <p className="text-sm font-semibold text-white">📅 Selected Slot:</p>
          <p className="text-md text-white font-medium">
            {dayjs(selectedDate).isValid()
              ? dayjs(selectedDate).format("dddd, D MMMM")
              : "No date selected"}
            {selectedSlot?.start?.time &&
              ` — ${formatTime(selectedSlot.start.time)}`}
            {selectedSlot?.end?.time &&
              ` to ${formatTime(selectedSlot.end.time)}`}
          </p>
          {selectedCourt && (
            <p className="text-sm text-blue-300">Court ID: {selectedCourt}</p>
          )}
        </div>

        {selectedSlot?.start && !selectedSlot?.end && (
          <div className="text-yellow-400 text-sm font-medium">
            ⚠️ Select an end time to complete your booking
          </div>
        )}

        {selectedSlot?.start && selectedSlot?.end && !selectedDurationValid && (
          <div className="text-red-500 text-sm font-medium">
            ⛔ Minimum playtime is {minDuration} minutes. Extend your game!
          </div>
        )}

        {/* Preview Price  */}
        {renderPreview()}

        <button
          disabled={!selectedDurationValid}
          className={`mt-2 px-6 py-2 rounded-lg text-white font-semibold transition
            ${
              selectedDurationValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
          onClick={() => {
            handleBooking();
          }}
        >
          Book Slot
        </button>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
