import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin and staff users
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'Admin@123', // In production, use proper authentication
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    username: 'staff',
    password: 'Staff@123',
    role: 'staff',
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = DEFAULT_USERS.find((u) => u.username === username && u.password === password);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password
      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (role: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
