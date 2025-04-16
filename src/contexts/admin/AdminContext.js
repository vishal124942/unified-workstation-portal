
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [workItems, setWorkItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData, error: usersError } = await supabase
        .from('users_meta')
        .select('*');

      const { data: workItemsData, error: workItemsError } = await supabase
        .from('work_items')
        .select('*');

      if (!usersError && usersData) {
        setUsers(usersData);
      }

      if (!workItemsError && workItemsData) {
        setWorkItems(workItemsData);
      }
    };

    fetchData();

    const usersSubscription = supabase
      .channel('users_meta_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users_meta' }, fetchData)
      .subscribe();

    const workItemsSubscription = supabase
      .channel('work_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'work_items' }, fetchData)
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
      workItemsSubscription.unsubscribe();
    };
  }, []);

  const addUser = async (user) => {
    const { error } = await supabase.from('users_meta').insert([user]);
    if (error) throw error;
  };

  const updateUser = async (id, data) => {
    const { error } = await supabase.from('users_meta').update(data).eq('id', id);
    if (error) throw error;
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
  };

  const getUserWorkItems = async (userId) => {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  };

  const updateUserAllowedSoftware = async (userId, software) => {
    const { error } = await supabase
      .from('users_meta')
      .update({ allowed_software: software })
      .eq('id', userId);
    if (error) throw error;
  };

  const updateWorkItemStatus = async (workItemId, status) => {
    const { error } = await supabase
      .from('work_items')
      .update({ status })
      .eq('id', workItemId);
    if (error) throw error;
  };

  const value = {
    users,
    workItems,
    addUser,
    updateUser,
    deleteUser,
    getUserWorkItems,
    updateUserAllowedSoftware,
    acceptWorkItem: (workItemId) => updateWorkItemStatus(workItemId, 'accepted'),
    rejectWorkItem: (workItemId) => updateWorkItemStatus(workItemId, 'rejected')
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
