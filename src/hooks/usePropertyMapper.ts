import { UserProfile } from '@/contexts/AuthContext';

/**
 * Helper function to standardize property names between UI components and Supabase
 */
export const usePropertyMapper = () => {
  // Maps UI property names to Supabase database column names
  const mapUItoDatabase = (data: Partial<any>): Partial<any> => {
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
        default:
          mappedData[key] = value;
      }
    });
    
    return mappedData;
  };

  // Maps Supabase database column names to UI property names for display
  const mapDatabaseToUI = (user: UserProfile): UserProfile & { 
    profilePicture?: string, 
    allowedSoftware?: string[],
    workData?: Record<string, string[]>
  } => {
    if (!user) return user;
    
    return {
      ...user,
      // Add UI-friendly property names while keeping the original ones
      profilePicture: user.profile_picture,
      allowedSoftware: user.allowed_software,
      // workData is a derived property we calculate for UI components
      workData: {} // Placeholder - would be populated with actual data
    };
  };

  return {
    mapUItoDatabase,
    mapDatabaseToUI
  };
};
