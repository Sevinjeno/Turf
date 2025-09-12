import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm';
import { loginUser, registerUser } from '../../services/Users/index';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleAuthSubmit = async (method: 'email' | 'phone', data: any) => {
    try {
      let response;
      if (method === 'email') {
        response = await loginUser(data.email);
      } else {
        // handle phone logic if needed
      }

      if (response.token) {
        localStorage.setItem('token', response.token);
        const role = response.data?.role;
        navigate(role === 'admin' ? '/admin/dashboard' : '/user');
      }
    } catch (error: any) {
      console.error('Authentication error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm onSubmit={handleAuthSubmit} />
    </div>
  );
};

export default LoginPage;
