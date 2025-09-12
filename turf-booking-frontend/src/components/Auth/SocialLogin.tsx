import React from 'react';

interface Props {
  onGoogleLogin: () => void;
}

const SocialLogin: React.FC<Props> = ({ onGoogleLogin }) => {
  return (
    <div className="text-center mt-4">
      <div className="text-gray-500 mb-4">OR</div>
      <button
        type="button"
        onClick={onGoogleLogin}
        className="flex items-center justify-center gap-3 w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
      >
        <img src="/google-icon.svg" alt="Google Icon" className="w-6 h-6" />
        Sign in with Google
      </button>
    </div>
  );
};

export default SocialLogin;