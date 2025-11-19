import { useState, ChangeEvent } from "react";
import { User as UserIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import axios from "axios";

interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string; // profile photo URL
}
interface ProfileMenuProps {
  user: User | null;   // or undefined depending on your Redux default
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({user}) => {

  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Editable fields
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // For preview when user uploads new image
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      // Later: send file to Cloudinary or backend to save permanently
    }
  };

  const handleSave = async () => {
    console.log("Saved profile:", {
      name,
      phone,
      email,
      avatar: preview || avatar,
    });
    setShowEdit(false);

    // try{
    //    const response = await axios("http://localhost:3000/api/user/")

    // }catch(err){
    //   console.log(err)
    // }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
        )}
        <span className="font-medium">{user?.name || "User"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
          <button
            onClick={() => {
              setShowEdit(true);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            Edit Profile
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">
            Logout
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            {/* Image upload */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={preview || avatar || ""}
                alt="avatar preview"
                className="w-20 h-20 rounded-full object-cover bg-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                }}
              />
              <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
