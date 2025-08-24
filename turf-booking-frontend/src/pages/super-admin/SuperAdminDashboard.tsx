import { useState } from "react";
import UserCreationForm from "./CreationForm";
import Home from "./home/Home";
import Admins from "./admins/Admins";
import Users from "./users/Users";
import Sidebar from "../../components/Sidebar/Sidebar";

const SuperAdminDashboard = () => {
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar - Fixed Width */}
        <div className="w-64 bg-gray-900 text-white fixed h-screen p-4">
          <Sidebar
            title="Super Admin"
            menuItems={[
              { name: "Home", key: "home" },
              { name: "Create", key: "create" },
              { name: "Admins", key: "admins" },
              { name: "Users", key: "users" },
            ]}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
        </div>

        {/* Main Content - Takes Remaining Space */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Super Admin Dashboard
          </h1>

          {/* Conditional Rendering of Selected Content */}
          {selectedTab === "home" && <Home />}
          {selectedTab === "create" && (
            <UserCreationForm onSuccess={setMessage} />
          )}
          {selectedTab === "admins" && <Admins />}
          {selectedTab === "users" && <Users />}

          {/* Success Message */}
          {message && (
            <p className="mt-4 text-lg font-medium text-green-600">{message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
