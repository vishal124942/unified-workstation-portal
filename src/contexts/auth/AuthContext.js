
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
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

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (username, email, password, role) => {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) throw signUpError;

    const { error: metaError } = await supabase
      .from('users_meta')
      .insert([{
        id: user.id,
        username,
        role,
        allowed_software: role === 'user' ? ['VS CODE', 'GITHUB'] : [],
      }]);

    if (metaError) {
      await supabase.auth.admin.deleteUser(user.id);
      throw metaError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (data) => {
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
