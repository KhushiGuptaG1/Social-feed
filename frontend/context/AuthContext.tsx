import { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Configure Axios once
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:4000'; // Backend URL
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post('/auth/login', { username, password });
      const accessToken = res.data.access_token; // make sure backend sends this
      setToken(accessToken);
      setUser({ username }); // You can replace with actual user data from backend
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await axios.post('/auth/register', { username, password });
    } catch (err: any) {
      console.error('Registration failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
