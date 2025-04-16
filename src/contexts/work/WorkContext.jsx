
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/AuthContext';

const WorkContext = createContext();

export const WorkProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const generateSSOToken = async (softwareName) => {
    if (!currentUser) throw new Error('No user logged in');
    return `sso_${currentUser.id}_${softwareName}_${Date.now()}`;
  };

  const saveWorkData = async (softwareName, workContent) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('work_items')
      .insert([{
        user_id: currentUser.id,
        software: softwareName,
        content: workContent,
      }]);

    if (error) throw error;
  };

  const value = {
    generateSSOToken,
    saveWorkData
  };

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (context === undefined) {
    throw new Error('useWork must be used within a WorkProvider');
  }
  return context;
};
