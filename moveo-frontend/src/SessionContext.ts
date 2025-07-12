import * as React from 'react';
import type { Session } from '@toolpad/core';

export interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const SessionContext = React.createContext<SessionContextValue>({
  session: null,
  setSession: () => {},
  accessToken: null,
  setAccessToken: () => {},
  userRole: null,
  setUserRole: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function useSession() {
  return React.useContext(SessionContext);
}

// Storage keys
const TOKEN_KEY = 'moveo_access_token';
const SESSION_KEY = 'moveo_session';
const ROLE_KEY = 'moveo_user_role';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      console.warn('Failed to store access token');
    }
  },
  
  remove: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      console.warn('Failed to remove access token');
    }
  }
};

export const sessionStorage = {
  get: (): Session | null => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  
  set: (session: Session): void => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      console.warn('Failed to store session');
    }
  },
  
  remove: (): void => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      console.warn('Failed to remove session');
    }
  }
};

export const roleStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(ROLE_KEY);
    } catch {
      return null;
    }
  },
  
  set: (role: string): void => {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      console.warn('Failed to store user role');
    }
  },
  
  remove: (): void => {
    try {
      localStorage.removeItem(ROLE_KEY);
    } catch {
      console.warn('Failed to remove user role');
    }
  }
};
