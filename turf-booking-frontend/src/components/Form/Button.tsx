import React from 'react';

interface Props {
  type?: 'button' | 'submit';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({ type = 'button', loading = false, children, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
