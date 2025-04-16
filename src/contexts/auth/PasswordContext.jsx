
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const changePassword = async (oldPassword, newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const resetPassword = async (email, resetCode, newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const value = {
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return <PasswordContext.Provider value={value}>{children}</PasswordContext.Provider>;
};

export const usePassword = () => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
};
