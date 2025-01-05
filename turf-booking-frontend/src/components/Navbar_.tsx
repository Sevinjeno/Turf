import axios from 'axios';
import React, { useState } from 'react'

interface City {
    display_name: string;
    type: string;
    osm_type:string;
  }
  
  function Navbar_() {
    const [query, setQuery] = useState<string>(''); // Type for query is a string
    const [cities, setCities] = useState<City[]>([]); // Type for cities is an array of City objects
  
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        try {
          setQuery(event.target.value);
      
          if (event.target.value.length) {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                q: event.target.value,
                format: 'json',
              },
            });
      debugger
      const cityResults = response.data.filter((item: City) => item.osm_type === 'node' || item.osm_type === 'relation');
            setCities(cityResults);
          }
        } catch (error) {
          console.error('Error fetching city data:', error);
        }
      };
    return (
        <div className="flex justify-between items-center bg-white shadow-md p-4">
        <div className="text-lg font-bold text-blue-600">7Jeno</div>
        
        <div className="flex flex-col w-[700px] items-center relative"> {/* Flex column layout */}
            <div className='flex '>
                
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for a city"
            className="w-full p-2 text-sm"
          />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
            Search
           </button>
            </div>
            <div>
                
          {query && (
                        <ul className="absolute w-[300px] mt-1 ml-[-8rem] overflow-y-auto bg-white border border-gray-300 shadow-lg z-10">
                        {cities.map((city, index) => (
                            <li key={index} className="p-2 border-b border-gray-300 cursor-pointer truncate hover:bg-gray-100">
                            {city.display_name}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
          
          {/* Results list positioned below the input */}
      
        </div>
        
      
        <div className="flex items-center space-x-4">
          <button className="text-gray-600">Login / Signup</button>
        </div>
      </div>
      
      
      );
}

export default Navbar_