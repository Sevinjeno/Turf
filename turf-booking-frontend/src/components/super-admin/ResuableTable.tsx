import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface TableProps {
  title: string; // Title of the table
  data: User[]; // Array of user objects
  columns: (keyof User)[]; // Array of column keys
}

const ReusableTable = ({ title, data, columns }: TableProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow-md">
          <thead>
            <tr className="border bg-gray-200">
              {columns.map((col) => (
                <th key={col.toString()} className="p-3 text-left capitalize">
                  {col.toString()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.toString()} className="p-3">
                    {row[col] as string | number}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReusableTable;
