// src/components/Navbar.tsx
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setQuery, setCities, setCityCoordinates } from '../../features/citySlice';
import axios from 'axios';
import { User } from '../../types/user';

//! Infinite Scrolling / Lazy loading will be added later ...

//  ?   Debouncing and Caching in Implemented

type NavbarProps = {
  user?: User|string; // Define the type of user if known  
};

function Navbar_(props:NavbarProps) {
  const dispatch = useDispatch(); // Dispatch actions
  const query = useSelector((state: any) => state.city.query); // Access query from Redux state
  const cities = useSelector((state: any) => state.city.cities); // Access cities from Redux state
  const [selected,setSelected]=useState<string>("")
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchvalue:any) => {
    const searchValue = searchvalue ;
    dispatch(setQuery(searchValue)); // Update the query in Redux state

    if (searchValue.length > 0) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: searchValue,
            format: 'json',
          },
        });

        const cityResults = response.data.filter((item: any) => 
          item.osm_type === 'node' || item.osm_type === 'relation'
        );
        dispatch(setCities(cityResults)); // Update cities in Redux state
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    }
  };

  const handleCityClick = (city:any) => {
    setSelected(city.display_name)
     // Fetch the latitude and longitude of the selected city
     const lat = +city.lat;  // Assuming the latlon object exists in the response
     const lon = +city.lon;  // Assuming the latlon object exists in the response
    dispatch(setQuery(""));
    // Dispatch the latitude and longitude to Redux store
    dispatch(setCityCoordinates({ lat, lon }));

  };

  //? Debouncing function 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue:any = event.target.value;
    dispatch(setQuery(searchValue));
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear previous timeout
    }
    debounceTimeout.current = setTimeout(() => handleSearch(searchValue), 300); // Delay the request by 300ms
  };

  return (
    <div className="flex justify-between items-center bg-white shadow-md p-4">
      <div className="text-lg font-bold text-blue-600">7Jeno</div>
      <div className="flex flex-col w-[700px] items-center relative">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a city"
            className="w-full p-2 text-sm"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Search</button>
        </div>
        <div>
          {query && (
            <ul className="absolute w-[300px] mt-1 ml-[-8rem] overflow-y-auto bg-white border border-gray-300 shadow-lg z-10">
              {cities.map((city:any, index:any) => (
                <li
                  key={index}
                  // className="p-2 border-b border-gray-300 cursor-pointer truncate hover:bg-gray-100"
                  onClick={() => handleCityClick(city)}
                >
                  {city.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && <div>{selected}</div>}
      </div>
    </div>
  );
}

export default Navbar_;
