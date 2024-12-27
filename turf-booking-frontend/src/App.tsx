import { Route, Routes } from 'react-router-dom';
import './Main.css'
import Login from './components/Login';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';

function App(){
  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/user" element={<UserDashboard />} />
    </Routes>
    </>
  )
  
  
}
export default App;
