
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users_meta')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData) {
          console.error('Error fetching user data:', userError);
          setCurrentUser(null);
        } else {
          setCurrentUser({
            ...userData,
            email: session.user.email,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (username: string, email: string, password: string, role: string) => {
    try {
      // First create the auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !user) {
        console.error("Auth signup error:", signUpError);
        throw signUpError;
      }

      console.log("Auth user created:", user.id);
      
      // Then create the user metadata
      const { error: metaError } = await supabase
        .from('users_meta')
        .insert([{
          id: user.id,
          username,
          role,
          allowed_software: role === 'user' ? ['VS CODE', 'GITHUB'] : [],
        }]);

      if (metaError) {
        console.error("Failed to create user metadata:", metaError);
        // Try to clean up the auth user if metadata creation fails
        await supabase.auth.admin.deleteUser(user.id).catch(e => {
          console.error("Failed to delete auth user after metadata creation failed:", e);
        });
        throw metaError;
      }
      
      console.log("User metadata created successfully");
    } catch (error) {
      console.error("Signup process failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users_meta')
      .update(data)
      .eq('id', currentUser.id);

    if (error) throw error;
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
