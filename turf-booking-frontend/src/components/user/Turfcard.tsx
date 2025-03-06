
const TurfCard = ({ turf }:any) => {
  console.log(turf.imag_url)
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={turf.image_url} alt={turf.name} className="h-40 w-full object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold">{turf.name}</h3>
          <p className="text-gray-500">{turf.location} ({(turf.distance / 1000).toFixed(2)} km)</p>
          <div className="flex justify-between items-center mt-2">
            {/* <button className="bg-blue-500 text-white px-2 py-1 rounded">
              Bookable
            </button> */}
          </div>
        </div>
      </div>
    );
  };
  
  export default TurfCard;