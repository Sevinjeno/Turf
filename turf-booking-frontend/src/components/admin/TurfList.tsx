import React from "react";

export default function TurfList() {
  const turfs = [
    {
      id: 1,
      name: "Green Field Turf",
      location: "Bandra, Mumbai",
      price: 1200,
      image: "https://via.placeholder.com/400x250.png?text=Green+Field",
    },
    {
      id: 2,
      name: "Skyline Turf",
      location: "Andheri, Mumbai",
      price: 1500,
      image: "https://via.placeholder.com/400x250.png?text=Skyline+Turf",
    },
    {
      id: 3,
      name: "Elite Arena",
      location: "Borivali, Mumbai",
      price: 1000,
      image: "https://via.placeholder.com/400x250.png?text=Elite+Arena",
    },
  ];

  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Turfs</h1>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{turf.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{turf.location}</p>
              <p className="text-md text-green-600 font-bold mt-2">₹{turf.price} / hour</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
