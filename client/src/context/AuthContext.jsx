import { createContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      authApi
        .getProfile()
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { token: jwt, user: userData } = res.data.data;
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
    return res;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { token: jwt, user: userData } = res.data.data;
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    const res = await authApi.getProfile();
    setUser(res.data.data.user);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
