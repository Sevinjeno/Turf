   export default function TurfTable(){
        const bookings = [
            { id: "#TURF1", user: "User 1", turf: "Turf A", date: "2025-07-01" },
            { id: "#TURF2", user: "User 2", turf: "Turf B", date: "2025-07-02" },
            { id: "#TURF3", user: "User 3", turf: "Turf C", date: "2025-07-03" },
        ];

   return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded shadow overflow-auto mt-6">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Booking ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Turf</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{booking.id}</td>
                <td className="px-4 py-2">{booking.user}</td>
                <td className="px-4 py-2">{booking.turf}</td>
                <td className="px-4 py-2">{booking.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
   );
}