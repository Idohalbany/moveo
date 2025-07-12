import { useSession } from '../SessionContext';

export const useRole = () => {
  const { userRole } = useSession();

  const isAdmin = userRole === 'ADMIN';
  const isUser = userRole === 'USER';
  
  const hasRole = (role: string) => userRole === role;
  const hasAnyRole = (roles: string[]) => roles.includes(userRole || '');
  
  const canAccessTags = true;
  const canAccessCalls = false;

  return {
    userRole,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
    canAccessTags,
    canAccessCalls,
  };
};

export default useRole;
