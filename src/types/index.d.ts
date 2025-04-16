
// Define user types
export interface UserMetadata {
  id: string;
  username: string;
  role: string;
  allowed_software: string[];
  profile_picture?: string;
}

export interface UserProfile extends UserMetadata {
  email: string;
  created_at?: string;
}

// Define work item types
export interface WorkItem {
  id: string;
  user_id: string;
  software: string;
  content: string;
  status: string;
  created_at: string;
}

export interface UIWorkItem extends Omit<WorkItem, 'user_id'> {
  // Map from database fields to UI-friendly names
  userId: string;
  username: string; 
  displayDate: string;
  createdAt?: string; // For compatibility with existing code
}
