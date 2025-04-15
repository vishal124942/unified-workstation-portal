import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  allowedSoftware?: string[];
  ssoTokens?: Record<string, string>;
  workData?: Record<string, string[]>;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<void>;
  generateSSOToken: (softwareName: string) => Promise<string>;
  saveWorkData: (softwareName: string, workContent: string) => Promise<void>;
}

// Mock users for demo
const MOCK_USERS: UserProfile[] = [
  {
    id: "1",
    username: "testuser",
    email: "user@example.com",
    role: "user",
    profilePicture: "",
    allowedSoftware: ["VS CODE", "JUPYTER NOTEBOOK", "POSTMAN", "GITHUB"],
    ssoTokens: {},
    workData: {}
  },
  {
    id: "2",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    profilePicture: "",
    ssoTokens: {},
    workData: {}
  }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [resetCodes, setResetCodes] = useState<Record<string, string>>({});

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user to local storage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Auth methods
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error("User not found");
      }
      
      // In a real app, you'd verify the password here
      setCurrentUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser: UserProfile = {
        id: Date.now().toString(),
        username,
        email,
        role,
        profilePicture: "",
        allowedSoftware: role === "user" ? ["VS CODE", "GITHUB"] : undefined,
        ssoTokens: {},
        workData: {}
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return Promise.reject("No user logged in");
    
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    
    // Update in users array too
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    return Promise.resolve();
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    // In a real app, you'd verify the old password and update with the new one
    return Promise.resolve();
  };

  // New methods for forgot password functionality
  const forgotPassword = async (email: string) => {
    try {
      // Check if user exists
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error("No account found with this email");
      }
      
      // Generate a reset code (6-digit number)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store reset code (in a real app, this would be stored in a database with an expiration time)
      setResetCodes(prev => ({ ...prev, [email]: resetCode }));
      
      // In a real app, you would send an email with the reset code
      console.log(`Reset code for ${email}: ${resetCode}`);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string) => {
    try {
      // Verify reset code
      const storedCode = resetCodes[email];
      if (!storedCode || storedCode !== resetCode) {
        throw new Error("Invalid reset code");
      }
      
      // Find user by email
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          // In a real app, you'd hash the new password
          return user; // Password would be updated here
        }
        return user;
      });
      
      // Update users
      setUsers(updatedUsers);
      
      // Remove reset code
      const newResetCodes = { ...resetCodes };
      delete newResetCodes[email];
      setResetCodes(newResetCodes);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  // SSO and work data methods
  const generateSSOToken = async (softwareName: string) => {
    if (!currentUser) return Promise.reject("No user logged in");
    
    // In a real app, this would generate a secure token for SSO
    const token = `sso_${currentUser.id}_${softwareName}_${Date.now()}`;
    
    // Store token
    const updatedUser = {
      ...currentUser,
      ssoTokens: {
        ...currentUser.ssoTokens,
        [softwareName]: token
      }
    };
    setCurrentUser(updatedUser);
    
    // Update in users array too
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    return token;
  };

  const saveWorkData = async (softwareName: string, workContent: string) => {
    if (!currentUser) return Promise.reject("No user logged in");
    
    // Get current work data or initialize empty array
    const currentWorkData = currentUser.workData || {};
    const softwareWorkData = currentWorkData[softwareName] || [];
    
    // Add new work content
    const updatedWorkData = {
      ...currentWorkData,
      [softwareName]: [...softwareWorkData, workContent]
    };
    
    // Update user
    const updatedUser = {
      ...currentUser,
      workData: updatedWorkData
    };
    setCurrentUser(updatedUser);
    
    // Update in users array too
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    return Promise.resolve();
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
    saveWorkData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Admin context for user management
export interface AdminContextType {
  users: UserProfile[];
  addUser: (user: UserProfile) => void;
  updateUser: (id: string, data: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  getUserWorkItems: (userId: string) => WorkItem[];
  updateUserAllowedSoftware: (userId: string, software: string[]) => void;
  acceptWorkItem: (workItemId: string) => void;
  rejectWorkItem: (workItemId: string) => void;
}

export interface WorkItem {
  id: string;
  userId: string;
  username: string;
  software: string;
  content: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  const addUser = (user: UserProfile) => {
    setUsers([...users, user]);
  };

  const updateUser = (id: string, data: Partial<UserProfile>) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...data } : user));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getUserWorkItems = (userId: string) => {
    return workItems.filter(item => item.userId === userId);
  };

  const updateUserAllowedSoftware = (userId: string, software: string[]) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, allowedSoftware: software } : user
    ));
  };

  const acceptWorkItem = (workItemId: string) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "accepted" } : item
    ));
  };

  const rejectWorkItem = (workItemId: string) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "rejected" } : item
    ));
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserWorkItems,
    updateUserAllowedSoftware,
    acceptWorkItem,
    rejectWorkItem
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
