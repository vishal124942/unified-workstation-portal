
// Export all contexts from a single file
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import { PasswordProvider, usePassword } from './auth/PasswordContext.jsx';
import { AdminProvider, useAdmin } from './admin/AdminContext.jsx';
import { WorkProvider, useWork } from './work/WorkContext.jsx';
import { RootProvider } from './RootProvider';

// Export all providers
export {
  AuthProvider,
  useAuth,
  PasswordProvider,
  usePassword,
  AdminProvider,
  useAdmin,
  WorkProvider,
  useWork,
  RootProvider
};

// Export types from the existing file
export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user'
};
