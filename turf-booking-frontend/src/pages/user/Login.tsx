import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/Auth/AuthForm";
import OtpInput from "../../components/user/OtpInput";
import { sendOtp, verifyOtp } from '../../services/Users/authServices';
import { setAccessToken, setUser } from "../../features/auth/authSlice";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/5.jpg",
  "/images/8.jpg",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showOtpComp, setShowOtpComp] = useState(false);
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [value, setValue] = useState(""); // store email or phone
  const [resendTimer, setResendTimer] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev: any) => (prev + 1) % images.length);
    }, 30000); // Change every 100 seconds

    return () => clearInterval(interval);
  }, []);

const handleAuthSubmit = async (submitMethod: "email" | "phone", data: string) => {
  setMethod(submitMethod);
  setValue(data); // save email or phone for OTP verification
  setLoading(true)
  try {
    await sendOtp(submitMethod, data); // call backend API
    setShowOtpComp(true);
    setResendTimer(30); // start resend countdown
  } catch (err) {
    setShowOtpComp(false);
    console.error("Error sending OTP:", err);
  }finally{
    setLoading(false)
  }
};

const handleOtpSubmit = async () => {
  try {
    const res = await verifyOtp(method, value, otp); // call backend verify OTP
    console.log(res?.user,res?.accessToken)
   setUser(res?.user)
   setAccessToken(res?.accessToken)

    navigate("/user"); // redirect after success
  } catch (err) {
    console.error("Invalid OTP:", err);
  }
};
  const handleResendOtp = () => {
    setResendTimer(30);
    // Re-send OTP API call logic here
  };

  const handleBack = () => {
    setShowOtpComp(false);
    setOtp(""); // clear OTP input
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <main className="h-full md:min-h-screen bg-white flex flex-col lg:grid lg:grid-cols-3 overflow-hidden">
      {/* Right Column (Background / Image / Animation) */}
      <div className="relative w-full h-[48vh] sm:h-[70vh] lg:col-span-2 lg:h-auto overflow-hidden">
        {/* ✅ Changed h-96 to h-[60vh] for mobile to use viewport height for dynamic scaling, added sm:h-[70vh] for slightly larger small screens */}
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            loading="lazy"
            alt={`Background ${idx}`}
            className={`
          absolute top-0 left-0 w-full h-full object-cover  md:object-cover object-center transition-opacity duration-[3000ms] ease-in-out
          ${idx === currentImageIndex ? "opacity-100" : "opacity-0"}`}
            /* ✅ Changed object-cover to object-contain for mobile to avoid cropping, reverts to object-cover on md+ */
          />
        ))}

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 md:opacity-10"></div>
        {/* ✅ Increased opacity to 0.30 on mobile for better text contrast, reverts to 0.10 on md+ */}

        <h1
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        text-2xl sm:text-3xl md:text-8xl font-bold text-white opacity-90 text-center pointer-events-none select-none px-6 md:px-4"
          /* ✅ Reduced text size to text-2xl on mobile, added sm:text-3xl for small screens, increased padding to px-6 on mobile to prevent overflow */
        >
          Level Up Your Game.
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center bg-white px-6 py-4 space-y-6 md:col-span-1 overflow-hidden">
        {showOtpComp && (
          <button
            onClick={() => handleBack()}
            className="flex items-center justify-center px-3 py-2 rounded-full hover:bg-gray-100 text-gray-700 shadow-md mb-2"
          >
            ← Back
          </button>
        )}
        {/* ✅ Made the form centered horizontally with `items-center` and added padding */}

        <img src="/logo.png" alt="Logo" className="w-24 md:w-40" />
        {/* ✅ Smaller logo on mobile for better fit */}

        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 text-center">
          Find & Play Nearby
        </h1>
        {/* ✅ Responsive text sizes and centered text for readability */}

        <p className="text-sm md:text-md text-gray-600 leading-relaxed text-center">
          Easily locate sports grounds and book instantly.
          <br />
          Your next game is just a click away.
        </p>
        {/* ✅ Text center-aligned for mobile clarity */}

        {!showOtpComp ? (
          <AuthForm onSubmit={handleAuthSubmit} loading={loading} />
        ) : (
          <OtpInput
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            resendOtp={handleResendOtp}
            resendTimer={resendTimer}
          />
        )}
        {/* ✅ No changes here but now sits nicely under content */}
      </div>
    </main>
  );
};

export default LoginPage;
