import axios from 'axios';
import { API } from '../../services/api';
export const loginAdminApi = async (credentials:any) => {
  let URl=`${API}/api/admins/login`
  console.log("URl",URl)
  const res = await axios.post(URl, credentials, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchAdminApi = async () => {
  const res=await axios.get(`${API}/api/admins/me`, {
    withCredentials: true,
  }); 
    return res.data;  
}

export const logoutAdminApi = async () => {
  const res = await axios.post(`${API}/api/admins/logout`, {}, {
    withCredentials: true,
  });
  return res.data;
}

export const fetchAdmins = async (id?:number) => {
  const url = id ? `${API}/api/admins/${id}` : `${API}/api/admins`;
  const response = await axios.get(url);
  return response.data.data;
};