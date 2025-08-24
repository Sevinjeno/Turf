import { fetchAdmins } from "../../../features/admin/services";
import React, { useEffect, useState } from "react";
import AdminDetail from "./AdminDetail";

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
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const response = await fetchAdmins(); // ✅ calls the imported service
        setAdmins(response);
      } catch (err) {
        0;
        setError("Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admins List</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!selectedAdminId ? (
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
                <tr
                  key={id}
                  className="hover:bg-gray-100"
                  onClick={() => setSelectedAdminId(id)}
                >
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
      ) : (
        <AdminDetail
          adminId={selectedAdminId}
          onBack={() => setSelectedAdminId(null)}
        />
      )}
    </div>
  );
};

export default Admins;
