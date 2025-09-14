import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/Auth/AuthForm";
import { loginUser, registerUser } from "../../services/Users/index";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/5.jpg",
];

const LoginPage = () => {
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev: any) => (prev + 1) % images.length);
    }, 100000); // Change every 100 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAuthSubmit = async (method: "email" | "phone", data: any) => {
    try {
      let response;
      if (method === "email") {
        response = await loginUser(data.email);
      } else {
        // handle phone logic if needed
      }

      if (response.token) {
        localStorage.setItem("token", response.token);
        const role = response.data?.role;
        navigate(role === "admin" ? "/admin/dashboard" : "/user");
      }
    } catch (error: any) {
      console.error(
        "Authentication error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-3 h-screen">
        {/* Left Column - Auth Form */}
        <div className="col-span-1 flex flex-col items-start justify-center bg-white px-8 space-y-6">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="w-32 md:w-40" />

          {/* Highlight */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Find & Play Nearby
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Seamlessly discover sports venues around you.
            <br />
            Book your game in just a few clicks.
            <br />
          </p>

          {/* Auth Form */}
          <AuthForm onSubmit={handleAuthSubmit} />
        </div>

        {/* Right Column - Background / Image / Animation */}
        <div className="col-span-2 relative overflow-hidden">
          {/* Example: Background image */}
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Background ${idx}`}
              className={`
      absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-[3000ms] ease-in-out
      ${idx === currentImageIndex ? "opacity-100" : "opacity-0"}
    `}
            />
          ))}

          {/* Example: Animated shapes */}

          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 "></div>
          <h1
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 text-6xl md:text-8xl font-bold text-white opacity-90 pointer-events-none select-none"
          >
            Level Up Your Game.
          </h1>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
