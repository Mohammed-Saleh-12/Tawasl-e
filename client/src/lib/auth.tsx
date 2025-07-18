import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for existing login status instead of always clearing it
    if (typeof window !== 'undefined') {
      const storedLoginStatus = localStorage.getItem('platform_logged_in');
      setIsLoggedIn(storedLoginStatus === 'true');
    }
  }, []);

  const login = () => {
    localStorage.setItem('platform_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('platform_logged_in');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 