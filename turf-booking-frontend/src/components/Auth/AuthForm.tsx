import React, { useState } from "react";
import { Mail, Smartphone } from "lucide-react";
import Button from "../Form/Button";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface AuthFormProps {
  onSubmit: (method: "email" | "phone", data: any) => void;
}

type AuthMode = "phone" | "email" | "google";

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [authMode, setAuthMode] = useState<AuthMode>("phone");
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const validatePhone = (phone: string) => {
    const clean = phone.replace(/\s|-/g, "");
    if (!/^[\d+]+$/.test(clean)) return false;

    try {
      const phoneNumber = parsePhoneNumberFromString(clean, "IN");
      if (!phoneNumber) return false;
      if (!phoneNumber.isValid()) return false;

      const nationalNumber = phoneNumber.nationalNumber;
      if (phoneNumber.country === "IN" && nationalNumber.length !== 10) return false;

      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!value.trim()) {
      setError(`Please enter ${name}`);
      setIsValid(false);
      return;
    }

    if (name === "phone") {
      if (!validatePhone(value)) {
        setError("Invalid phone number");
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    } else if (name === "email") {
      if (!validateEmail(value)) {
        setError("Invalid email address");
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit")
    if (!isValid) return; // Don't submit if invalid
    if (authMode === "phone" || authMode === "email") {
    onSubmit(authMode, formData);
  }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-sm text-gray-600 font-semibold mb-4 text-left">
        Just Quick Info About You! Almost There
      </h2>

      {/* Mode Selection Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          onClick={() => {setAuthMode("phone"); setFormData({ email: "", phone: "" }); setError("")}}
          className={`${
            authMode === "phone" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } flex items-center justify-center border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm`}
        >
          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Phone
        </Button>

        <Button
          onClick={() => {setAuthMode("email"); setFormData({ email: "", phone: "" });setError("")}}
          className={`${
            authMode === "email" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } flex items-center justify-center border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm`}
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Email
        </Button>

        <Button
          onClick={() => setAuthMode("google")}
          className={`${
            authMode === "google" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } flex items-center justify-center border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm`}
        >
          <img src="/images/google3.svg" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Google
        </Button>
      </div>

      {/* OTP Input Form */}
      {(authMode === "phone" || authMode === "email") && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {(authMode === "phone" || authMode === "email") && (
            <input
              type={authMode}
              name={authMode}
              placeholder={`Enter your ${authMode}`}
              value={formData[authMode]}
              onChange={handleChange}
              className={`w-full px-2 py-2 rounded border focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                isValid
                  ? "border-green-500 focus:ring-green-400"
                  : error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 text-white rounded transition-all duration-300 text-xs sm:text-sm ${
              isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send OTP
          </button>
        </form>
      )}

      {/* Google Mode Info */}
      {authMode === "google" && (
        <p className="mt-3 text-center text-gray-500 text-xs sm:text-sm">
          Redirecting to Google Sign-In...
        </p>
      )}
    </div>
  );
};

export default AuthForm;
