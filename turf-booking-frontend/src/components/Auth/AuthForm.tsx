import React, { useState } from 'react';
import AuthTabs from './AuthTabs';

interface AuthFormProps {
  onSubmit: (method: 'email' | 'phone', data: any) => void;
}

type AuthMode = "phone" | "email" | "google";

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  // State for switching between email and phone form fields
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');

  // State for switching between login and register tabs
   const [authMode, setAuthMode] = useState<AuthMode>("phone");

  const [formData, setFormData] = useState({ email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contactMethod, formData);
  };

  return (
 <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Just Quick Info About You! Almost There
      </h2>

      {/* Mode Selection Buttons */}
      <div className="flex justify-between mb-4 gap-2">
        <button
          className={`flex-1 py-2 rounded-lg border ${
            authMode === "phone" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setAuthMode("phone")}
        >
          Phone
        </button>
        <button
          className={`flex-1 py-2 rounded-lg border ${
            authMode === "email" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setAuthMode("email")}
        >
          Email
        </button>
        <button
          className={`flex-1 py-2 rounded-lg border ${
            authMode === "google" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          } flex items-center justify-center gap-2`}
          onClick={() => setAuthMode("google")}
        >
          <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>
      </div>

      {/* OTP Input Form */}
      {(authMode === "phone" || authMode === "email") && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {authMode === "phone" && (
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {authMode === "email" && (
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Send OTP
          </button>
        </form>
      )}

      {/* Google mode info */}
      {authMode === "google" && (
        <p className="mt-4 text-center text-gray-500">
          Redirecting to Google Sign-In...
        </p>
      )}
    </div>
  );
};

export default AuthForm;
