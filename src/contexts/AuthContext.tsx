import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserMetadata, WorkItem } from '@/lib/supabase';

// Types
export type UserRole = 'user' | 'admin';

export interface UserProfile extends UserMetadata {
  email?: string;
  profilePicture?: string;
  allowedSoftware?: string[];
  workData?: Record<string, string[]>;
}

// Export WorkItem type for other components
export type { WorkItem };

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<void>;
  generateSSOToken: (softwareName: string) => Promise<string>;
  saveWorkData: (softwareName: string, workContent: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
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

  const signup = async (username: string, email: string, password: string, role: UserRole) => {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) throw signUpError;

    const { error: metaError } = await supabase
      .from('users_meta')
      .insert([
        {
          id: user.id,
          username,
          role,
          allowed_software: role === 'user' ? ['VS CODE', 'GITHUB'] : [],
        },
      ]);

    if (metaError) {
      // Cleanup: delete the auth user if metadata insertion fails
      await supabase.auth.admin.deleteUser(user.id);
      throw metaError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');

    // Convert profilePicture to profile_picture if present
    const supabaseFormattedData: any = { ...data };
    if ('profilePicture' in data) {
      supabaseFormattedData.profile_picture = data.profilePicture;
      delete supabaseFormattedData.profilePicture;
    }

    const { error } = await supabase
      .from('users_meta')
      .update(supabaseFormattedData)
      .eq('id', currentUser.id);

    if (error) throw error;

    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const generateSSOToken = async (softwareName: string) => {
    if (!currentUser) throw new Error('No user logged in');
    return `sso_${currentUser.id}_${softwareName}_${Date.now()}`;
  };

  const saveWorkData = async (softwareName: string, workContent: string) => {
    if (!currentUser) throw new Error('No user logged in');

    const { error } = await supabase
      .from('work_items')
      .insert([
        {
          user_id: currentUser.id,
          software: softwareName,
          content: workContent,
        },
      ]);

    if (error) throw error;
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    generateSSOToken,
    saveWorkData,
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

// Admin context for user management
export interface AdminContextType {
  users: UserProfile[];
  workItems: WorkItem[];
  addUser: (user: UserProfile) => Promise<void>;
  updateUser: (id: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserWorkItems: (userId: string) => Promise<WorkItem[]>;
  updateUserAllowedSoftware: (userId: string, software: string[]) => Promise<void>;
  acceptWorkItem: (workItemId: string) => Promise<void>;
  rejectWorkItem: (workItemId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

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

    // Subscribe to realtime changes
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

  const addUser = async (user: UserProfile) => {
    const { error } = await supabase
      .from('users_meta')
      .insert([user]);
    if (error) throw error;
  };

  const updateUser = async (id: string, data: Partial<UserProfile>) => {
    const { error } = await supabase
      .from('users_meta')
      .update(data)
      .eq('id', id);
    if (error) throw error;
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
  };

  const getUserWorkItems = async (userId: string) => {
    const { data, error } = await supabase
      .from('work_items')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  };

  const updateUserAllowedSoftware = async (userId: string, software: string[]) => {
    const { error } = await supabase
      .from('users_meta')
      .update({ allowed_software: software })
      .eq('id', userId);
    if (error) throw error;
  };

  const updateWorkItemStatus = async (workItemId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('work_items')
      .update({ status })
      .eq('id', workItemId);
    if (error) throw error;
  };

  const acceptWorkItem = (workItemId: string) => updateWorkItemStatus(workItemId, 'accepted');
  const rejectWorkItem = (workItemId: string) => updateWorkItemStatus(workItemId, 'rejected');

  const value = {
    users,
    workItems,
    addUser,
    updateUser,
    deleteUser,
    getUserWorkItems,
    updateUserAllowedSoftware,
    acceptWorkItem,
    rejectWorkItem,
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
