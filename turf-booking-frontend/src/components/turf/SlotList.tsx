import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

const SlotList: React.FC<{ turfId: number }> = ({ turfId }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/turfs/${turfId}/slots`);
        setSlots(response.data);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [turfId]);

  return (
    <div>
      {loading ? <p>Loading slots...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {slots.length > 0 ? (
            slots.map(slot => (
              <button 
                key={slot.id} 
                className={`p-2 border rounded-md ${slot.is_booked ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
                disabled={slot.is_booked}
              >
                {slot.start_time} - {slot.end_time}
              </button>
            ))
          ) : (
            <p>No slots available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotList;
