import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('register');
  const navigate = useNavigate();

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleOTPChange = (e:any) => {
    setOTP(e.target.value);
  };


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users', {
        ...formData,
        action,
        // otp,
      });
      debugger
      setMessage(response.data.message);
      // Save JWT token in localStorage or cookies
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      if(response.data.status=="login") navigate('/user')
      
    } catch (error:any) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };
  return (
    <div className=' h-[100vh] flex items-center justify-center p-10'>

            <div className="w-full  md:w-[450px]">
                    <h1 className='text-center text-white font-bold text-4xl mb-10 md:text-6xl'>Login</h1>
                    <form className=' flex flex-col gap-3 bg-white p-6 min-h-[150px] rounded-xl drop-shadow-xl' onSubmit={handleSubmit}>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                    <Input name="email" value={formData.email} onChange={handleChange} />
                    {/* <Input name="otp" value={otp} onChange={handleOTPChange} /> */}
                    <Button type="submit" text="Login" onClick={()=>setAction('login')} />
                    <Button type="submit" text="Register" onClick={()=>setAction('register')} />
                    </form>
                    {message && <p className="text-center mt-4">{message}</p>}
            </div>

    </div>
   
  )
}

export default Login