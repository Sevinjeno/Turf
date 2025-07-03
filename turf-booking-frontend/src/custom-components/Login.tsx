import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('login');
  const navigate = useNavigate();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getApiUrl = () => (action === 'login' ? '/api/users/login' : '/api/users');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url = getApiUrl();
      const requestData = action === 'login' ? { email: formData.email } : formData;
      const response = await axios.post("http://localhost:3000"+url, requestData);

      setMessage(response.data.message);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      const userRole = response.data.data.role;
      navigate(userRole === 'admin' ? '/admin/dashboard' : '/user');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 py-2 font-semibold text-lg border-b-2 ${
              action === 'login' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            } transition-all duration-300`}
            onClick={() => setAction('login')}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 font-semibold text-lg border-b-2 ${
              action === 'register' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            } transition-all duration-300`}
            onClick={() => setAction('register')}
          >
            Register
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {action === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            {action === 'login' ? 'Login' : 'Register'}
          </button>

          <div className="text-center text-gray-500">OR</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            Sign in with Google
          </button>
        </form>
        
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
