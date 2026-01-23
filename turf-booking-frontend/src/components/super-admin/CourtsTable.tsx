type Court = {
  id?: string;
  name: string;
  price: number;
  status: "draft" | "saved";
};

interface Props {
  courts: Court[];
  onChange: (courts: Court[]) => void;
  onSave: (index: number) => void;
  onDelete: (index: number) => void;
}

const CourtsTable = ({ courts, onChange, onSave, onDelete }: Props) => {
  const updateCourt = (
    index: number,
    key: "name" | "price",
    value: string | number
  ) => {
    const updated = [...courts];

    if (key === "name" && typeof value === "string") {
      updated[index].name = value;
    }

    if (key === "price" && typeof value === "number") {
      updated[index].price = value;
    }

    onChange(updated);
  };

  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Court Name</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {courts.map((court, index) => (
          <tr key={index}>
            <td className="p-2 border">
              <input
                type="text"
                value={court.name}
                disabled={court.status === "saved"}
                onChange={(e) =>
                  updateCourt(index, "name", e.target.value)
                }
                className="w-full border px-2 py-1 rounded disabled:bg-gray-100"
              />
            </td>

            <td className="p-2 border">
              <input
                type="number"
                value={court.price}
                disabled={court.status === "saved"}
                onChange={(e) =>
                  updateCourt(index, "price", Number(e.target.value))
                }
                className="w-full border px-2 py-1 rounded disabled:bg-gray-100"
              />
            </td>

            <td className="p-2 border">
              <div className="flex gap-2">
                {court.status === "draft" && (
                  <button
                    type="button"
                    onClick={() => onSave(index)}
                    className="text-green-600 hover:underline"
                  >
                    Save
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CourtsTable;
