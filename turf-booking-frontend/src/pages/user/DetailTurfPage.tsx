import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Turf {
  id: number;
  name: string;
  description: string;
  slots: string[];
}

function DetailTurfPage() {
  const { id } = useParams<{ id: string }>(); // Get Turf ID from URL
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/turfs/${id}`);
        console.log("Res",response)
        setTurf(response.data);
      } catch (err) {
        setError('Failed to fetch turf details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-white p-6">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : turf ? (
        <div>
          <h1 className="text-2xl font-bold">{turf.name}</h1>
          <p>{turf.description}</p>
          <h2 className="mt-4 text-xl font-semibold">Available Slots:</h2>
          <ul className="list-disc ml-5">
            {turf.slots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No details found.</p>
      )}
    </div>
  );
}

export default DetailTurfPage;
