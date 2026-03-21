import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken } from "../utils/secureStore";
import api from "../api/api";
import { navigate } from "../utils/navigation";

type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch user on app start
  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const token = await getToken("accessToken");

  //       if (!token) {
  //         setLoading(false);
  //         return;
  //       }

  //       const res = await api.get("/users/me"); // 🔥 important
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log("User fetch failed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUser();
  // }, []);

  // 🔥 TEMP: auto login
  useEffect(() => {
  setUser({
    id: "1",
    name: "Dev User",
    token: "fake-token",
  });
   setLoading(false);
}, []);

  // 🔓 Logout
  const logout = async () => {

    try{w
        await api.get("/auth/logout");
    }catch(e){}
    
    await removeToken("accessToken");
    await removeToken("refreshToken");

    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Hook to use anywhere
export const useAuth = () => {
  return useContext(AuthContext)!;
};