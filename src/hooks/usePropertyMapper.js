
import { useCallback } from 'react';

export const usePropertyMapper = () => {
  const mapUItoDatabase = useCallback((data) => {
    const mappedData = {};
    
    Object.entries(data).forEach(([key, value]) => {
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
  }, []);

  const mapDatabaseToUI = useCallback((data) => {
    if (!data) return data;
    
    return {
      ...data,
      profilePicture: data.profile_picture,
      allowedSoftware: data.allowed_software,
      workData: {} // Placeholder - would be populated with actual data
    };
  }, []);

  const mapWorkItemToUI = useCallback((item, username) => {
    return {
      ...item,
      userId: item.user_id,
      createdAt: item.created_at,
      username: username
    };
  }, []);

  return {
    mapUItoDatabase,
    mapDatabaseToUI,
    mapWorkItemToUI
  };
};

