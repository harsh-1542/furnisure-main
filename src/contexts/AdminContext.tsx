
import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Check localStorage for admin status
    return localStorage.getItem('isAdmin') === 'true';
  });

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    localStorage.setItem('isAdmin', status.toString());
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin: setAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
