import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
