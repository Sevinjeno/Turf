import React from 'react'
import TurfCard from '../components/Turfcard';

type Props = {}

function TurfList({}: Props) {
    const turfs = [
        {
          name: "Battlefield Vibgyor Kalyan",
          location: "Kalyan",
          distance: 10.5,
          image: "https://via.placeholder.com/150",
        },
        {
          name: "HotFut Palava",
          location: "Palava City",
          distance: 12.7,
          image: "https://via.placeholder.com/150",
        },
        // Add more turfs...
      ];

  return (
      <div className="min-h-screen bg-gray-100">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {turfs
          .sort((a, b) => a.distance - b.distance)
          .map((turf, index) => (
            <TurfCard key={index} turf={turf} />
          ))}
      </div>
    </div>
  )
}

export default TurfList