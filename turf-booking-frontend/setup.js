import axios from "axios";
// Array of turfs with predefined data
const turfs = [
    { name: "Dombivli Turf", location: { lat: 19.2183, lon: 73.0865 }, adminId: 1, imageUrl: "https://example.com/dombivli.jpg" },
    { name: "Kalyan Turf", location: { lat: 19.2403, lon: 73.1305 }, adminId: 2, imageUrl: "https://example.com/kalyan.jpg" },
    { name: "Ulhas Turf", location: { lat: 19.2254, lon: 73.1642 }, adminId: 3, imageUrl: "https://example.com/ulhas.jpg" },
    { name: "Bangalore Turf", location: { lat: 12.9716, lon: 77.5946 }, adminId: 4, imageUrl: "https://example.com/bangalore.jpg" },
    { name: "Chennai Turf", location: { lat: 13.0827, lon: 80.2707 }, adminId: 5, imageUrl: "https://example.com/chennai.jpg" },
];

// Function to create a single turf in the database
const createTurf = async (turf) => {
    try {
        const response = await axios.post('http://localhost:3000/api/turfs/', turf);
        console.log(`${turf.name} created successfully:`, response.data);
    } catch (error) {
        console.error(`Failed to create ${turf.name}:`, error.message);
    }
};

// Function to create all turfs from the turfs array
const createAllTurfs = async () => {
    for (const turf of turfs) {
        await createTurf(turf);
    }
};

// Trigger the creation of all turfs
createAllTurfs();
