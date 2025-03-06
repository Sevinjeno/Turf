import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Admin = {
  id: number;
  email: string;
  name: string;
  phone: string;
};

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(()=>{
    const fetchAdmins=async()=>{
      try{
        const response = await axios.get("http://localhost:3000/api/admins");
        setAdmins(response.data.data);
      }catch (err) {
        setError("Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    }
    fetchAdmins();
  },[])
  return (
    <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Admins List</h2>

        {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {!loading && !error && (
      <div className="overflow-x-auto">
        <table className="min-w-full border shadow-md">
          <thead className="bg-gray-200">
            <tr>
              {["Email", "Name", "Phone"].map((header) => (
                <th key={header} className="border px-4 py-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(({ id, email, name, phone }) => (
              <tr key={id} className="hover:bg-gray-100">
                {[email, name, phone].map((value, index) => (
                  <td key={index} className="border px-4 py-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
  )
}

export default Admins