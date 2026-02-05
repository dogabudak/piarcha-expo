import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      // DEV ONLY: Auto-login with skeleton key if no token exists
      if (__DEV__ && !token) {
        console.log('🔓 DEV MODE: Auto-authenticating with skeleton key');
        await AsyncStorage.setItem('auth_token', 'DEV_SKELETON_KEY_TOKEN');
        setIsAuthenticated(true);
        return;
      }

      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuthStatus }}>
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
