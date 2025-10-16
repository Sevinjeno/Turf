import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DateSelector from "../../components/slots/DateSelector";
import TimeSlotGrid from "../../components/slots/TimeSlotGrid";
import dayjs from "dayjs";
import { fetchTurfSlots } from "../../services/Slots/index";
import { createBooking, getBookedSlots } from "../../services/Bookings/Index";
import { RootState, useAppDispatch } from "../../store";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCourtsbyTurfId } from "../../services/Courts/index";
import CourtDropdown from "../../components/user/CourtsDropdown";
interface Turf {
  id: number;
  name: string;
  admin_id: number | null;
  image_url: string;
  location: string;
  start_time: string;
  end_time: string;
  price: string;
  city: string;
}

type Slot = {
  time: string;
  status: string;
};

type SelectedSlot = {
  start: Slot | null;
  end: Slot | null;
};

function DetailTurfPage() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { id } = useParams(); // turf id
  const [turf, setTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [slots, setSlots] = useState([]);
  const [minBookingDuration, setMinBookingDuration] = useState(60);
  const dispatch = useAppDispatch();
  const [courts, setCourts] = useState<any[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  let user = {name:"",id:"",email:""};

  // Fetch courts for the turf

  // Fetch turf details
  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/turfs/${id}`
        );
        setTurf(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCourts = async () => {
      try {
        const courtsData = await getCourtsbyTurfId(id || "");
        setCourts(courtsData);
      } catch (err) {
        console.error("Failed to fetch courts:", err);
      }
    };

    fetchTurfDetails();
    fetchCourts();
  }, [id]);

  // Fetch slots for selected date

  const loadSlots = async () => {
    if (!id) return;
    const res = await fetchTurfSlots(id, selectedDate);
    setSlots(res.slots);
    setMinBookingDuration(res.minBookingDuration);
  };

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!selectedSlot?.start || !selectedSlot?.end) {
      console.error("Please select a valid slot range");
      return;
    }
    try {
      const startTime = dayjs(
        `${selectedDate}T${selectedSlot.start?.time}`
      ).toISOString();
      const endTime = dayjs(
        `${selectedDate}T${selectedSlot.end?.time}`
      ).toISOString();
      const bookingData = {
        turf_id: id, // Replace with actual turfId
        user_id: user?.id, // Replace with actual userId (maybe from auth context)
        start_time: startTime, // Use correct datetime format
        end_time: endTime,
        slot_id: null, // Optional, can be null or the slot id
        court_id: selectedCourt, // Use selected court
      };
      const result = await createBooking(bookingData);
      setSelectedSlot({ start: null, end: null });
      await loadSlots(); // Reload slots after booking
      console.log("Booking Success:", result);
    } catch (error: any) {
      console.error("Booking failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4 sm:p-6 md:p-8">
      {turf ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Turf Info */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            {/* Turf Image */}
            <img
              src={`http://localhost:3000${turf.image_url}`} // Replace with actual key from DB
              alt={turf.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevents infinite loop
                target.src = "http://localhost:3000/uploads/Turf_Wall.jpg";
              }}
              className="w-full h-60 object-cover sm:h-72 md:h-80"
            />

            <div className="p-4 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-800">{turf.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{turf.city}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  🕐 {turf.start_time} - {turf.end_time}
                </span>
                {/* <span>💰 ₹{turf.price}</span> */}
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedSlot={setSelectedSlot}
            />
          </div>

          <CourtDropdown
            courts={courts}
            selectedCourt={selectedCourt}
            setSelectedCourt={setSelectedCourt}
          />

          {/* Time Slots */}
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <TimeSlotGrid
              slots={slots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              selectedDate={selectedDate}
              minDuration={minBookingDuration}
              handleBooking={handleBooking}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700 font-semibold text-lg">
          Loading turf details...
        </div>
      )}
    </div>
  );
}

export default DetailTurfPage;
