import { UserProfile } from '@/contexts/AuthContext';
import { WorkItem as SupabaseWorkItem } from '@/lib/supabase';

export interface UIWorkItem extends Omit<SupabaseWorkItem, 'user_id' | 'created_at'> {
  userId: string;
  username?: string;
  createdAt: string;
}

/**
 * Helper function to standardize property names between UI components and Supabase
 */
export const usePropertyMapper = () => {
  // Maps UI property names to Supabase database column names
  const mapUItoDatabase = (data: Partial<UserProfile>): Record<string, any> => {
    const mappedData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      // Convert camelCase to snake_case for specific properties
      switch (key) {
        case 'profilePicture':
          mappedData.profile_picture = value;
          break;
        case 'allowedSoftware':
          mappedData.allowed_software = value;
          break;
        case 'workData':
          // Don't map this to database as it's a derived property
          break;
        default:
          mappedData[key] = value;
      }
    });
    
    return mappedData;
  };

  // Maps Supabase database column names to UI property names for display
  const mapDatabaseToUI = (data: UserMetadata): UserProfile => {
    if (!data) return data as unknown as UserProfile;
    
    return {
      ...data,
      // Add UI-friendly property names while keeping the original ones
      profilePicture: data.profile_picture,
      allowedSoftware: data.allowed_software,
      workData: {} // Placeholder - would be populated with actual data
    };
  };

  // Maps Supabase work items to UI-friendly format
  const mapWorkItemToUI = (item: SupabaseWorkItem, username?: string): UIWorkItem => {
    return {
      ...item,
      userId: item.user_id,
      createdAt: item.created_at,
      username: username
    };
  };

  return {
    mapUItoDatabase,
    mapDatabaseToUI,
    mapWorkItemToUI
  };
};
