const FilterBar = () => {
    const tabs = ["Venues", "Coaching"];
    return (
      <div className="flex space-x-4 bg-gray-100 p-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };
  
  export default FilterBar;