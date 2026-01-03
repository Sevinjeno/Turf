import axios from "axios";
import API from "../../services/api";
export const loginAdminApi = async (credentials: any) => {
  let URl = `${API}/api/admins/login`;
  const res = await axios.post(URl, credentials, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchAdminApi = async () => {
  const res = await axios.get(`${API}/api/admins/me`, {
    withCredentials: true,
  });
  return res.data;
};

export const logoutAdminApi = async () => {
  const res = await axios.post(
    `${API}/api/admins/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const fetchAdmins = async () => {
   const res = await API.get("/admins");
  if (!Array.isArray(res.data?.data)) {
    throw new Error("Invalid admins response");
  }

  return res.data.data;
};

export const fetchAdminById = async (id: number) => {
  const response = await API.get(
    `/admins/${id}`
  );

  if (!response.data?.data) {
    throw new Error("Admin not found");
  }

  return response.data.data;
};
