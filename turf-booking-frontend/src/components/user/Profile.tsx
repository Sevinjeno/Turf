import { useState } from "react";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface User {
  name?: string;
  email?: string;
  avatar?: string; // optional if you want profile image
}

interface ProfileMenuProps {
  user?: User|string; // user can be undefined initially
}

const ProfileMenu: React.FC<ProfileMenuProps> = () => {
   const user=useSelector((state:RootState)=>state.auth.user)
   console.log("user",user)
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(user?.id);
  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [email, setEmail] = useState(user?.email);
  const [showEdit, setShowEdit] = useState(false);

  const handleSave = () => {
    console.log("Saved profile:", { name, email });
    setShowEdit(false);
  };

  return (
    <div className="relative">
      {/* Profile button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
       {user? (
  <img
    src={""}
    alt="profile"
    className="w-8 h-8 rounded-full"
  />
) : (
  <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
  </div>
)}
        <span className="font-medium">{"User"}</span>
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
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
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
}

export default ProfileMenu;
