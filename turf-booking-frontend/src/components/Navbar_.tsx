import React from 'react'

type Props = {}

function Navbar_({}: Props) {
    return (
     
            <div className="flex justify-between items-center bg-white shadow-md p-4">
            <div className="text-lg font-bold text-blue-600">7Jeno</div>
            <div className="flex items-center space-x-4">
            <input
                id="location-search"
                type="text"
                placeholder="Enter location"
                className="border border-gray-300 p-2 rounded-lg w-64"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
            </button>
            </div>
            <div className="flex items-center space-x-4">
            <button className="text-gray-600">Login / Signup</button>
            </div>
            </div>
      );
}

export default Navbar_