import {
  createTurf,
  updateTurf,
  fetchTurfsByAdminId,
} from "../../../services/Turf";
import { fetchAdmins } from "../../../features/admin/services";
import { useEffect, useState } from "react";

interface AdminDetailProps {
  adminId: number;
  onBack: () => void;
}

type Turf = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  admin_id: number;
  location: string;
  price: number;
  start_time: string;
  end_time: string;
  courts: number;
  image_url?: string;
  city?: string; // assuming location is a string
};

type TurfFormData = {
  name: string;
  lat: number;
  lon: number;
  adminId: number;
  startTime: string;
  endTime: string;
  courts: number;
  price: number;
  imageUrl: File | null;
  city: string|undefined;
};

const AdminDetail: React.FC<AdminDetailProps> = ({ adminId, onBack }) => {
  const [formData, setFormData] = useState<TurfFormData>({
    name: "",
    lat: 0,
    lon: 0,
    adminId: adminId,
    startTime: "",
    endTime: "",
    price: 0,
    courts: 0,
    imageUrl: null,
    city:"",
  });

  const [adminTurfs, setAdminTurfs] = useState<Turf[]>([]);
  const [editingTurf, setEditingTurf] = useState<Turf | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false); // 🔹 toggles form visibility

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAdmins(adminId); // optional: display admin info if needed
        const turfResponse = await fetchTurfsByAdminId(adminId);
        setAdminTurfs(turfResponse);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    if (adminId) loadData();
  }, [adminId]);

  useEffect(() => {
    if (editingTurf) {
      setFormData({
        name: editingTurf.name,
        lat: editingTurf.lat,
        lon: editingTurf.lon,
        adminId: editingTurf.admin_id,
        startTime: editingTurf.start_time,
        endTime: editingTurf.end_time,
        courts: editingTurf.courts,
        price: editingTurf.price,
        imageUrl: null,
        city: editingTurf.city, // assuming location is a string
      });
      setShowForm(true); // 🔹 show form when editing
    }
  }, [editingTurf]);

  async function handleSubmit(event: any) {
    event.preventDefault();

    const turfData = {
      name: formData.name,
      location: { lat: formData.lat, lon: formData.lon },
      adminId: formData.adminId,
      imageUrl: formData.imageUrl,
      startTime: formData.startTime,
      endTime: formData.endTime,
      courts: formData.courts,
      price: formData.price,
      city: formData.city,
    };

    try {
      if (editingTurf) {
        await updateTurf(editingTurf.id, turfData);
        console.log("Turf updated");
      } else {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("lat", formData.lat.toString());
        form.append("lon", formData.lon.toString());
        form.append("courts", formData.courts.toString());
        form.append("price", formData.price.toString());
        form.append("startTime", formData.startTime);
        form.append("endTime", formData.endTime);
        form.append("adminId", formData.adminId.toString());
        if (formData.imageUrl) form.append("image", formData.imageUrl);
        await createTurf(form);
        console.log("Turf created");
      }

      // Reset form
      setFormData({
        name: "",
        lat: 0,
        lon: 0,
        adminId: adminId,
        imageUrl: null,
        startTime: "",
        endTime: "",
        courts: 0,
        price: 0,
        city:"",
      });

      setEditingTurf(null);
      setShowForm(false); // 🔹 hide form after submit

      // Refresh
      const updated = await fetchTurfsByAdminId(adminId);
      setAdminTurfs(updated);
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file" && files
          ? files[0]
          : type === "number"
          ? Number(value)
          : value,
    }));
  }

  function handleCreateNewTurfClick() {
    setEditingTurf(null);
    setFormData({
      name: "",
      lat: 0,
      lon: 0,
      adminId: adminId,
      imageUrl: null,
      startTime: "",
      endTime: "",
      courts: 0,
      price: 0,
      city  : "",
    });
    setShowForm(true); // 🔹 show form when "Create" is clicked
  }

  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-2">Admin ID: {adminId}</h2>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Assigned Turfs</h3>
      </div>

      {adminTurfs.length === 0 ? (
        <p>No turfs assigned.</p>
      ) : (
        <table className="w-full mb-8 border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Lat</th>
              <th className="p-2 border">Lon</th>
              <th className="p-2 border">Price (₹)</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminTurfs.map((turf) => (
              <tr key={turf.id}>
                <td className="p-2 border">{turf.name}</td>
                <td className="p-2 border">{turf.lat}</td>
                <td className="p-2 border">{turf.lon}</td>
                <td className="p-2 border">{turf.price}</td>
                <td className="p-2 border">
                  {turf.start_time} - {turf.end_time}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => setEditingTurf(turf)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!showForm && (
        <div>
          <button
            onClick={handleCreateNewTurfClick}
            className="bg-green-500 text-white px-4 py-2 mt-6 rounded hover:bg-green-600"
          >
            ➕ Create New Turf
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-4">
            {editingTurf ? "Edit Turf" : "Create New Turf"}
          </h3>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Turf Name</label>
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="number"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Number of Courts</label>
            <input
              type="number"
              name="courts"
              value={formData.courts}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">city</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {!editingTurf && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Turf Image</label>
              <input
                type="file"
                accept="image/*"
                name="imageUrl"
                onChange={handleChange}
                className="w-full"
              />
            </div>
          )}

          <div className="mb-4 flex gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingTurf ? "Update Turf" : "Create Turf"}
          </button>
        </form>
      )}

      {formData.imageUrl && !editingTurf && (
        <img
          src={URL.createObjectURL(formData.imageUrl)}
          className="w-32 h-32 mt-2 object-cover border rounded"
          alt="Preview"
        />
      )}
    </>
  );
};

export default AdminDetail;
