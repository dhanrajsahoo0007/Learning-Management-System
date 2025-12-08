import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

// Keep the same User interface for backward compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  const logout = () => {
    signOut();
  };

  // Transform Clerk user to our User interface
  const transformedUser: User | null = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: user.fullName || user.firstName || '',
    created_at: user.createdAt?.toISOString() || new Date().toISOString()
  } : null;

  return (
    <AuthContext.Provider value={{ 
      user: transformedUser, 
      loading: !isLoaded, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
