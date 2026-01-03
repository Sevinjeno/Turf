import React, { useEffect, useState } from "react";
import { fetchAdmins } from "../../../features/admin/services";
import AdminDetail from "./AdminDetail";

type Admin = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
};

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAdmins = async () => {
      try {
        const response = await fetchAdmins();
        if (isMounted) {
          
            if (Array.isArray(response)) {
              setAdmins(response);
            } else {
              setAdmins([]);
              setError("Invalid admins response");
            }
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch admins");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAdmins();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="p-6">Loading admins...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admins List</h2>

      {selectedAdminId == null ? (
        admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
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
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedAdminId(id)}
                  >
                    <td className="border px-4 py-2">{email}</td>
                    <td className="border px-4 py-2">{name}</td>
                    <td className="border px-4 py-2">
                      {phone ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
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
