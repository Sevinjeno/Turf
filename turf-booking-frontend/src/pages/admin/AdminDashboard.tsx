import React, { useEffect, useState } from "react";
import TurfList from "../../components/admin/TurfList";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { fetchAdmin } from "../../features/admin/middleware";
import { logoutAdminApi } from "../../features/admin/services";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import AdminHome from "../../components/admin/AdminHome";

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.admin.admin);
  let name = admin?.data?.name;

  useEffect(() => {
    dispatch(fetchAdmin());
  }, []);

  const [selectedTab, setSelectedTab] = useState("home");

  async function handleLogout() {
    // Handle login logic here
    let res = await logoutAdminApi();
    console.log("res", res);
    if (res) {
      console.log("Logout successful");
      navigate("/admin");
    } else {
      console.error("Logout failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white fixed h-screen p-4">
        <Sidebar
          title="Admin"
          menuItems={[
            { name: "Home", key: "home" },
            { name: "Create Project", key: "create" },
          ]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      {/* header Content */}
      <div className="flex-1 ml-64 p-4">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center rounded">
          <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Other Components */}
        <div className="mt-6">
          {selectedTab === "home" && <AdminHome />}
          {/* Add more components based on selectedTab */}
        </div>
      </div>
    </div>
  );
}
