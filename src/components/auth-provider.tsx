'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { getUserByEmail, addUser, getUserByUsername } from '@/lib/mock-data';

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (username: string, email: string, pass: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('artfolio-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string): boolean => {
    const foundUser = getUserByEmail(email);
    if (foundUser && foundUser.password === pass) {
      const { password, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('artfolio-user', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('artfolio-user');
    router.push('/');
  };

  const signup = (username: string, email: string, pass: string): boolean => {
    if (getUserByUsername(username) || getUserByEmail(email)) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `user${Date.now()}`,
      username,
      email,
      password: pass,
      avatarUrl: `https://picsum.photos/seed/${username}/100/100`,
    };
    addUser(newUser);
    const { password, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem('artfolio-user', JSON.stringify(userToStore));
    return true;
  };

  const value = { user, login, logout, signup };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
