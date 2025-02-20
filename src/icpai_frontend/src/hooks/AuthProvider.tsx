import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode })=> {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        setIdentity(client.getIdentity());
        setPrincipal(client.getIdentity().getPrincipal().toString());
        localStorage.setItem("principal", client.getIdentity().getPrincipal().toString());
        setIsAuthenticated(true);
      }
    };

    initAuth();
  }, []);
  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: () => {
        setIdentity(authClient.getIdentity());
        setIsAuthenticated(true);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setIsAuthenticated(false);
    localStorage.removeItem("principal");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);