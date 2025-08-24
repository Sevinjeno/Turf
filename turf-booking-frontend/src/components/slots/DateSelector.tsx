import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: null) => void;
}

const DateSelector = ({
  selectedDate,
  setSelectedDate,
  setSelectedSlot,
}: CalendarProps) => {
  const today = dayjs();
  const dates = [...Array(7)].map((_, i) => today.add(i, "day"));

  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };

    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* 7-day quick select (scrollable on mobile) */}
        <div className="flex overflow-x-auto gap-2 w-full md:w-auto">
          {dates.map((date) => {
            const dateStr = date.format("YYYY-MM-DD");
            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setSelectedSlot(null);
                }}
                className={`flex flex-col items-center px-3 py-2 min-w-[70px] rounded-md text-sm transition-all shrink-0 ${
                  selectedDate === dateStr
                    ? "bg-white text-black font-bold border border-gray-300"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <div>{date.format("ddd")}</div>
                <div>{date.format("D MMM")}</div>
              </button>
            );
          })}
        </div>

        {/* Calendar button */}
        <div className="relative shrink-0" ref={buttonRef}>
          <button
            onClick={() => setCalendarOpen((prev) => !prev)}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 whitespace-nowrap"
          >
            📅 Pick Date
          </button>

          {calendarOpen && (
            <div
              ref={calendarRef}
              className="absolute left-0 mt-2 bg-white p-2 rounded-md shadow-lg z-50"
            >
              <DatePicker
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                onChange={(date: Date) => {
                  const formatted = dayjs(date).format("YYYY-MM-DD");
                  setSelectedDate(formatted);
                  setCalendarOpen(false);
                }}
                minDate={new Date()}
                maxDate={dayjs().add(3, "month").toDate()}
                inline
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
