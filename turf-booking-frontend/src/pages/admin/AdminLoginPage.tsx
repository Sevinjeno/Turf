import React, { useState } from "react";
import Input from "../../custom-components/Input";
import axios from "axios";
import { API } from "../../api/index"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import { LoginAdmin } from "../../features/admin/middleware";
import { useAppDispatch } from "../../store";
type Props = {};

function AdminDashboard({}: Props) {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "firstadmin@gmail.com",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // immutability, creating a new object with new reference
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const response = await axios.post(`${API}/api/admins/login`,formData);
      const resultAction = await dispatch(LoginAdmin(formData));
      if (LoginAdmin.fulfilled.match(resultAction)) {
        console.log("✅ Fulfilled", resultAction.payload);
        navigate("/admin/adminDashboard");
      } else {
        console.log("❌ Rejected", resultAction.payload || resultAction.error);
      }
      // if(response?.data){
      //   navigate('/admin/adminDashboard');
      // }
      console.log("response", resultAction);
      // const { token, role } = response.data;
      // localStorage.setItem("token", token);
      // localStorage.setItem("role", role);
      // console.log("Login successful", role);
      // console.log("token", token);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        console.log("Admin Login Data:", formData);
        // console.log("token", token);
      }, 2000);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unexpected error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-center text-black font-bold text-4xl md:text-5xl mb-8">
          Admin Login
        </h1>

        {loading ? (
          // 🟡 Skeleton Loader UI
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded-md" />
            <div className="h-12 bg-gray-300 rounded-md" />
            <div className="h-12 bg-gray-300 rounded-md" />
          </div>
        ) : (
          // 🟢 Actual Form
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 transition-all"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
