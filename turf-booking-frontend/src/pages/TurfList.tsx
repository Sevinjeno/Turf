import React, { useEffect, useState } from 'react';
import TurfCard from '../components/Turfcard';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import axios from 'axios';
import mapboxgl from 'mapbox-gl'; // Import mapbox-gl
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'; 

interface Turf {
  id: number;
  name: string;
  distance: number;
}

// Set your Mapbox Access Token
// mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

function TurfList() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>({
    lat:12.9667001, // Example default latitude
    lon:80.246668,   // Example default longitude
  });;
  const [city, setCity] = useState<string>('');
  const [query, setQuery] = useState<string>(''); // Type for query is a string

  const radius: number = 5000000; // Radius in meters (5 km)

  // Fetch user's location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            //here user locations are getting set
            setUserLocation({ lat: latitude, lon: longitude });
            
            // Fetch city name using openstreet
            try {
              debugger
              const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                  lat: latitude,
                  lon: longitude,
                  format: 'json',
                },
              });
            // Extract city information
            const { address } = response.data;
            const city = address?.town || address?.city || 'Unknown City'; // Use town or city from the address

            setCity(city);
            } catch (err) {
              console.error('Error fetching city name:', err);
              setCity('Unknown');
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            setError('Unable to fetch location');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation not supported by your browser');
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  // Fetch turfs nearby dynamically
  useEffect(() => {
    if (userLocation) {
      const fetchTurfs = async () => {
        try {
          const response = await axios.get<Turf[]>('http://localhost:3000/api/turfs/nearby', {
            params: {
              lat: userLocation.lat,
              lon: userLocation.lon,
              radius,
            },
          });
          setTurfs(response.data);
        } catch (err) {
          setError('Failed to fetch turfs');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTurfs();
    }
  }, [userLocation]);

  // useEffect(() => {
  //   // Initialize Mapbox Geocoder
  //   const geocoder = new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken!,
  //     placeholder: 'Select for cities, places...',
  //     types: 'place',
  //   });

  //   const geocoderContainer = document.getElementById('location-search');
  //   if (geocoderContainer && geocoderContainer instanceof HTMLInputElement) {
  //     if (geocoderContainer.value) {
  //       geocoder.addTo(geocoderContainer);
  //     }
  //   }

  //   // Handle geocoder result event
  //   geocoder.on('result', (e: any) => {
  //     const [lon, lat] = e.result.center; // Extract coordinates
  //     setUserLocation({ lat, lon });
  //     setCity(e.result.text); // Set city name
  //     setLoading(false); // Stop loading once the result is fetched
  //   });

  //     // Define the callback function for 'result' event
  // const handleResult = (e: any) => {
  //   const [lon, lat] = e.result.center; // Extract coordinates
  //   setUserLocation({ lat, lon });
  //   setCity(e.result.text); // Set city name
  //   setLoading(false);
  // };

  // // Attach the event listener
  // geocoder.on('result', handleResult);

  // // Cleanup event listener on component unmount
  // return () => {
  //   // try {
  //   //   geocoder.off('result', handleResult);
  //   // } catch (error) {
  //   //   console.error('Failed to remove geocoder event listener:', error);
  //   // }
  // };
  // }, []);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    if (event.target.value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${event.target.value}&format=json`)
        .then(response => response.json())
        .then((data: any[]) => {  // Typing data as an array of any (you can improve this type further)
          const cityResults:any = data.filter((item: any) => item.type === 'city');
          setCity(cityResults);
        })
        .catch(error => console.error('Error fetching city data:', error));
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div id="location-search" className="mb-6"></div> 
      </div>
      <div className="flex flex-wrap justify-start gap-20">
        {turfs.length > 0 ? (
          turfs.map((turf, index) => (
            <div key={turf.id} className="turf-item sm:w-1/2 lg:w-1/4">
              <TurfCard key={index} turf={turf} />
              <p>Distance: {turf.distance.toFixed(2)} meters</p>
            </div>
          ))
        ) : (
          <p>No turfs found within the specified radius.</p>
        )}
</div>
    </div>
  );
}

export default TurfList;
