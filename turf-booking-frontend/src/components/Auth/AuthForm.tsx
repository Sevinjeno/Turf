import React, { useState } from 'react';
import AuthTabs from './AuthTabs';

interface AuthFormProps {
  onSubmit: (method: 'email' | 'phone', data: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  // State for switching between email and phone form fields
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');

  // State for switching between login and register tabs
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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
    <div>
      {/* AuthTabs switches between Login and Register */}
      <AuthTabs action={authMode} setAction={setAuthMode} />

      {/* Form for entering email or phone OTP */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {contactMethod === 'email' && (
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {contactMethod === 'phone' && (
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
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
    </div>
  );
};

export default AuthForm;
