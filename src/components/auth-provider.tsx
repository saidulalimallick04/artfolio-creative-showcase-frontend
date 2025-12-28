'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { loginUser, logoutUser, registerUser } from '@/actions/auth_action';
import { getAccountDetails } from '@/actions/accounts_action';

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, pass: string) => Promise<boolean>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const result = await getAccountDetails();
    if (result.success && result.data) {
      // Map API user to Frontend User type
      const apiUser = result.data;
      const frontendUser: User = {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email || '',
        profile_image: apiUser.profile_image,
        full_name: apiUser.full_name,
        bio: apiUser.bio,
      };
      setUser(frontendUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // The API expects 'email' and 'password'
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', pass);

    const result = await loginUser(formData);

    if (result.success) {
      // Fetch full details to update state
      await fetchUser();
      return true;
    }
    return false;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/');
    router.refresh(); // Refresh to clear server-side cookies from cache?
  };

  const signup = async (username: string, email: string, pass: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', pass);

    const result = await registerUser(formData);

    if (result.success) {
      // Auto login after signup? Or require manual login?
      // For now, return true and let user login
      return true;
    }
    return false;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = { user, login, logout, signup, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
