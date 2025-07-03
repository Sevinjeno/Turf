import { Route, Routes } from 'react-router-dom';
import './Main.css'
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import SuperAdminLogin from './pages/super-admin/SuperAdminLogin';
import Admins from './pages/super-admin/admins/Admins';
import Home from './pages/super-admin/home/Home';
import Users from './pages/super-admin/users/Users';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import DetailTurfPage from './pages/user/DetailTurfPage';

function App(){
  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
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
