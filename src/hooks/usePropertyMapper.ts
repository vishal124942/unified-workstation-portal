
import { UserProfile, WorkItem, UIWorkItem } from "@/types";

export function usePropertyMapper() {
  /**
   * Maps database properties to UI-friendly properties
   */
  const mapDatabaseToUI = (data: any = {}): any => {
    // Map database property names to UI-friendly names
    // This helps transition between snake_case (database) and camelCase (UI)
    return {
      // Common properties
      id: data.id || '',
      createdAt: data.created_at || '',
      
      // User specific properties
      username: data.username || '',
      email: data.email || '',
      role: data.role || '',
      profilePicture: data.profile_picture || '',
      allowedSoftware: data.allowed_software || [],
      
      // Work item specific properties
      userId: data.user_id || '',
      software: data.software || '',
      content: data.content || '',
      status: data.status || '',
    };
  };

  /**
   * Maps UI-friendly properties back to database properties
   */
  const mapUIToDatabase = (data: any = {}): any => {
    return {
      // Common properties
      id: data.id,
      created_at: data.createdAt,
      
      // User specific properties
      username: data.username,
      email: data.email,
      role: data.role,
      profile_picture: data.profilePicture,
      allowed_software: data.allowedSoftware,
      
      // Work item specific properties
      user_id: data.userId,
      software: data.software,
      content: data.content,
      status: data.status,
    };
  };

  return {
    mapDatabaseToUI,
    mapUIToDatabase,
  };
}

export default usePropertyMapper;
