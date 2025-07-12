import * as React from "react";
import CallIcon from "@mui/icons-material/Call";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Session } from "@toolpad/core/AppProvider";
import {
  SessionContext,
  tokenStorage,
  sessionStorage,
  roleStorage,
} from "./SessionContext";
import apiClient from "./utils/api";

// Role-based navigation generator
const getNavigationForRole = (role: string | null): Navigation => {
  const baseNavigation: Navigation = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      title: "Calls",
      icon: <CallIcon />,
    },
    {
      segment: "task",
      title: "Tasks",
      icon: <AssignmentIcon />,
    },
  ];

  // Add Tags for ADMIN users only
  if (role !== "ADMIN") {
    baseNavigation.push({
      segment: "tag",
      title: "Tags",
      icon: <LocalOfferIcon />,
    });
  }

  return baseNavigation;
};

const BRANDING = {
  title: "Moveo Call center",
  logo: <img src="/images/logo.svg" alt="moveo logo" />,
};

// Validate token by making a test API call
const validateToken = async (token: string): Promise<boolean> => {
  try {
    // You can replace this with an actual validation endpoint
    // For now, we'll just check if the token exists and is not empty
    return token.length > 0;
  } catch {
    return false;
  }
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const enhancedSetSession = React.useCallback((newSession: Session | null) => {
    setSession(newSession);
    if (newSession) {
      sessionStorage.set(newSession);
    } else {
      sessionStorage.remove();
    }
  }, []);

  const enhancedSetAccessToken = React.useCallback((token: string | null) => {
    setAccessToken(token);
    if (token) {
      tokenStorage.set(token);
      apiClient.setAuthToken(token);
    } else {
      tokenStorage.remove();
      apiClient.clearAuthToken();
    }
  }, []);

  // Enhanced setUserRole that also handles role persistence
  const enhancedSetUserRole = React.useCallback((role: string | null) => {
    setUserRole(role);
    if (role) {
      roleStorage.set(role);
    } else {
      roleStorage.remove();
    }
  }, []);

  // Generate navigation based on user role
  const navigation = React.useMemo(
    () => getNavigationForRole(userRole),
    [userRole]
  );

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession: enhancedSetSession,
      accessToken,
      setAccessToken: enhancedSetAccessToken,
      userRole,
      setUserRole: enhancedSetUserRole,
      isAuthenticated: !!(session && accessToken),
      isLoading,
    }),
    [
      session,
      enhancedSetSession,
      accessToken,
      enhancedSetAccessToken,
      userRole,
      enhancedSetUserRole,
      isLoading,
    ]
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={navigation}
        branding={BRANDING}
        session={session}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}
