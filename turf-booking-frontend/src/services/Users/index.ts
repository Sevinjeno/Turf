import axios from 'axios';

export const loginUser = async (email: string) => {
  const response = await axios.post('http://localhost:3000/api/users/login', { email }, {
    withCredentials: true
  });
  return response.data;
};

export const registerUser = async (name: string, email: string) => {
  const response = await axios.post('http://localhost:3000/api/users', { name, email }, {
    withCredentials: true
  });
  return response.data;
};
