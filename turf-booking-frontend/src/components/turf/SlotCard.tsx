import React from "react";

interface SlotCardProps {
  time: string;
  isBooked: boolean;
  onSelect: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ time, isBooked, onSelect }) => {
  return (
    <button
      className={`p-2 m-1 rounded-lg text-white w-full ${
        isBooked ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
      }`}
      disabled={isBooked}
      onClick={onSelect}
    >
      {time}
    </button>
  );
};

export default SlotCard;
