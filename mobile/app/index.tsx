import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../src/utils/secureStore";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken("refreshToken");

      if (token) setLoggedIn(true);

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return <Redirect href={loggedIn ? "/(tabs)" : "/login"} />;
}