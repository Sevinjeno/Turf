import api from "../services/api";
import { logout, setAccessToken, setUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../store";
import axios from "axios";
import { Children, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
   const [superAdmin,setSuperAdmin]=useState(false)
  useEffect(() => {
    if(window.location.pathname === "/sevinjeno") setSuperAdmin(true)
    const refreshSession = async () => {
      if (window.location.pathname === "/") {
        // login page
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true } // important to send HTTP-only cookie
        );
        console.log("Authprovider /auth/refresh", res?.data?.accessToken);
        console.log("Authprovider /auth/refresh", res?.data?.user);
        if (res.data.accessToken) {
          dispatch(setAccessToken(res.data.accessToken));
          dispatch(setUser(res.data.user));
        } else {
          dispatch(logout());
          navigate("/");
        }
      } catch (err) {
        // No valid session → redirect to login
        try {
          const retry = await axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true }
          );
          dispatch(setAccessToken(retry.data.accessToken));
          dispatch(setUser(retry.data.user));
          return;
        } catch {
          dispatch(logout());
          navigate("/");
        }
      } finally {
        setLoading(false); // hide loader
      }
    };

    refreshSession();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  if(superAdmin) return <>{children}</>

  return <>
  {children}
  </>;
};

export default AuthProvider;
