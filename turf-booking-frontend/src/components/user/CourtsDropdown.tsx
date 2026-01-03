import React from "react";

interface Court {
  id: string;
  name: string;
  is_active: boolean;
}

interface CourtDropdownProps {
  courts: Court[];
  selectedCourt: string;
  setSelectedCourt: (courtId: string) => void;
}

const CourtDropdown: React.FC<CourtDropdownProps> = ({
  courts,
  selectedCourt,
  setSelectedCourt,
}) => {
  console.log("courts",courts)
  if (!courts || courts.length <= 1) return null; // hide if only 1 court

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 w-full">
      <label className="block text-gray-700 font-medium mb-2">
        Select Court
      </label>
      <select
        value={selectedCourt}
        onChange={(e) => setSelectedCourt(e.target.value)}
        className="w-1/2 border rounded-lg p-2 text-gray-700"
      >
        <option value="">Choose a court</option>
        {Array.isArray(courts) && courts.length > 0 ? (
          courts.map((court) => (
            <option key={court.id} value={court.id}>
              {court.name}
            </option>
          ))
        ) : (
          <option disabled>No courts available</option>
        )}
      </select>
    </div>
  );
};

export default CourtDropdown;
