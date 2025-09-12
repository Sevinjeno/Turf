import { Route, Routes } from 'react-router-dom';
import './Main.css'
import Login from './pages/user/Login';
import LoginPage from './pages/user/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import SuperAdminLogin from './pages/super-admin/SuperAdminLogin';
import Admins from './pages/super-admin/admins/Admins';
import Home from './pages/super-admin/home/Home';
import Users from './pages/super-admin/users/Users';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import DetailTurfPage from './pages/user/DetailTurfPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App(){
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/" element={<LoginPage />} /> */}
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/adminDashboard" element={<AdminDashboard />} />
      <Route path="/Sevinjeno" element={<SuperAdminLogin />}>
                <Route path="home" element={<Home />} />
                <Route path="users" element={<Users />} />
                <Route path="admins" element={<Admins />} />
            </Route>
            <Route path="/turf/:id" element={<DetailTurfPage />} />

    </Routes>
    </>
  )
  
  
}
export default App;
