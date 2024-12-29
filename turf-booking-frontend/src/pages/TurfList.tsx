import React, { useEffect, useState } from 'react';
import TurfCard from '../components/Turfcard';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

interface Turf {
  name: string;
  location: string;
  distance: number;
  image: string;
  coords: { lat: number; lon: number };
}

type Coordinates = {
  lat: number;
  lon: number;
};

const turfs: Turf[] = [
  {
    name: 'Battlefield Vibgyor Kalyan',
    location: 'Kalyan',
    distance: 10.5,
    image: 'https://via.placeholder.com/150',
    coords: { lat: 19.076, lon: 72.8777 },
  },
  {
    name: 'HotFut Palava',
    location: 'Palava City',
    distance: 12.7,
    image: 'https://via.placeholder.com/150',
    coords: { lat: 19.0877, lon: 72.8877 },
  },
  // Add more turfs...
];

const calculateDistance = (
  { lat: lat1, lon: lon1 }: Coordinates,
  { lat: lat2, lon: lon2 }: Coordinates
): number => {
  const toRad = (value: number): number => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function TurfList() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filteredTurfs, setFilteredTurfs] = useState(turfs);

  useEffect(() => {
    initializeAutocomplete();
    
  }, []);

  // Initialize Mapbox Autocomplete
  const initializeAutocomplete = () => {
    const geocoder = new MapboxGeocoder({
      accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN', // Replace with your Mapbox token
      types: 'place',
      placeholder: 'Enter location...'
    });

    geocoder.addTo('#location-search'); // Attach geocoder to an HTML element

    geocoder.on('result', (e) => {
      const [lon, lat] = e.result.center; // Get coordinates of selected location
      setUserLocation([lat, lon]);

      // Filter turfs dynamically based on distance
      const nearbyTurfs = turfs
        .map((turf) => ({
          ...turf,
          distance: calculateDistance(
            { lat, lon }, // User's location as Coordinates
            turf.coords // Turf's location as Coordinates
          ),
        }))
        .filter((turf) => turf.distance <= 20); // Filter turfs within 20 km

      setFilteredTurfs(nearbyTurfs);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div id="location-search" className="mb-6"></div> {/* Mapbox Autocomplete Input */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTurfs
          .sort((a, b) => a.distance - b.distance)
          .map((turf, index) => (
            <TurfCard key={index} turf={turf} />
          ))}
      </div>
    </div>
  );
}

export default TurfList;
