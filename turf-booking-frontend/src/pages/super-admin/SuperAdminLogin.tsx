import Input from '../../custom-components/Input';
import axios from 'axios';
import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';

type Props = {}

function SuperAdminLogin({}: Props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e:any) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/api/superadmin/login`, { username, password });
            const { token } = response.data;

            // Store token in localStorage
            localStorage.setItem("token", token);

            // Redirect to Super Admin Dashboard
            navigate("/superadmin/dashboard");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };


  return (
    
    <div>

    <div className=' h-[100vh] flex items-center justify-center p-10'>

    <div className="w-full  md:w-[450px]">
            <h1 className='text-center text-white font-bold text-4xl mb-10 md:text-6xl'>Login</h1>
        <h2>Super Admin Login</h2>
        <form className=' flex flex-col gap-3 bg-white p-6 min-h-[150px] rounded-xl drop-shadow-xl' onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <Input
                    name='text'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <Input
                    name='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
      </div>
      </div>
      <main>
                <Outlet /> {/* Renders the child routes */}
            </main>
      </div>
  )
}

export default SuperAdminLogin