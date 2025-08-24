export const getCityFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          format: "json",
          lat,
          lon,
        },
        headers: {
          "User-Agent": "your-turf-booking-app" // Required
        }
      }
    );

    return response.data.address.city || response.data.address.town || response.data.address.village;
  } catch (error) {
    console.error("Nominatim Error:", error.message);
    return null;
  }
};