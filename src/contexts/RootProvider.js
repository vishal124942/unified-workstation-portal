
import React from 'react';
import { AuthProvider } from './auth/AuthContext';
import { PasswordProvider } from './auth/PasswordContext';
import { AdminProvider } from './admin/AdminContext';
import { WorkProvider } from './work/WorkContext';

export const RootProvider = ({ children }) => {
  return (
    <AuthProvider>
      <PasswordProvider>
        <AdminProvider>
          <WorkProvider>
            {children}
          </WorkProvider>
        </AdminProvider>
      </PasswordProvider>
    </AuthProvider>
  );
};
