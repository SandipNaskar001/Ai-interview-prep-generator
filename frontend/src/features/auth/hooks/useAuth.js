import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
  login,
  register,
  logout,
  getMe,
} from "../services/auth.api";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  // Login
  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);

      const data = await login({ email, password });

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);

      const data = await register({
        username,
        email,
        password,
      });

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Get current user
  const fetchUser = async () => {
    try {
      setLoading(true);

      const data = await getMe();

      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }

      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };



  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    fetchUser,
  };
};