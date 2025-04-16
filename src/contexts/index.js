
// Export all contexts from a single file
import { AuthProvider, useAuth } from './auth/AuthContext';
import { PasswordProvider, usePassword } from './auth/PasswordContext.jsx';
import { AdminProvider, useAdmin } from './admin/AdminContext.jsx';
import { WorkProvider, useWork } from './work/WorkContext';
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

// Define WorkItem type for JavaScript
/**
 * @typedef {Object} WorkItem
 * @property {string} id - The work item ID
 * @property {string} user_id - The user ID
 * @property {string} software - The software name
 * @property {string} content - The work content
 * @property {string} status - The work status
 * @property {string} created_at - The creation date
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - The user ID
 * @property {string} username - The username
 * @property {string} email - The email
 * @property {string} role - The user role
 * @property {string} profile_picture - URL to profile picture
 * @property {Array<string>} allowed_software - List of allowed software
 * @property {string} created_at - The creation date
 */

/**
 * @typedef {Object} UserMetadata
 * @property {string} id - The user ID
 * @property {string} username - The username
 * @property {string} role - The user role
 * @property {Array<string>} allowed_software - List of allowed software
 */
