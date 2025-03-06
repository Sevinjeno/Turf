import React from "react";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface AdminTableProps {
  admins: Admin[];
}

const AdminTable: React.FC<AdminTableProps> = ({ admins }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin List</h2>

      {admins.length === 0 ? (
        <p className="text-gray-500">No admins found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow-md">  
          <thead>
            <tr className="border bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border hover:bg-gray-100">
                <td className="p-3">{admin.id}</td>
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTable;
