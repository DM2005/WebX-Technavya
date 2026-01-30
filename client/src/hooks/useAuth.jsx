import { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role,
    isValidRole: !!user?.role,
    loading,
  };
};
