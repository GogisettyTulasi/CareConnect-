import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, clearCurrentUser, getUsers, saveUsers } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email?.toLowerCase() === email?.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...userWithoutPassword } = found;
    setCurrentUser(userWithoutPassword);
    setUser(userWithoutPassword);
  };

  const signup = (data) => {
    const users = getUsers();
    const exists = users.some((u) => u.email?.toLowerCase() === data.email?.trim().toLowerCase());
    if (exists) {
      throw new Error('Email already registered');
    }
    const newUser = {
      id: String(Date.now()),
      name: data.name?.trim() || '',
      email: data.email?.trim() || '',
      password: data.password,
      phone: data.phone?.trim() || '',
      location: data.location?.trim() || '',
      role: data.role || 'Donor',
    };
    const updated = [...users, newUser];
    saveUsers(updated);
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        isLogistics: user?.role === 'Logistics',
        isDonor: user?.role === 'Donor',
        isRecipient: user?.role === 'Recipient',
        isUser: user?.role === 'Donor' || user?.role === 'Recipient',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
