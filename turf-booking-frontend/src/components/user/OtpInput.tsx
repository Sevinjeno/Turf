
interface OtpInputProps{
    otp: string;
  setOtp: (value: string) => void;
  onSubmit: () => void;
  resendOtp: () => void;
  resendTimer: number;
}


const OtpInput:React.FC<OtpInputProps>=({ otp, setOtp, onSubmit, resendOtp, resendTimer })=>{

 return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Enter OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-xl"
      />
      <button
        onClick={onSubmit}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Verify OTP
      </button>

      <button
        onClick={resendOtp}
        disabled={resendTimer > 0}
        className={`mt-2 ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 underline'}`}
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
      </button>
    </div>
  );
    
}

export default OtpInput