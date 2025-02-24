import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory, canisterId, createActor } from "../../../declarations/icpai_user";

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  principal: string | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const userIdentity = client.getIdentity();
        if (userIdentity) {
          setIdentity(userIdentity);
          setIsAuthenticated(true);
          setPrincipal(userIdentity.getPrincipal().toText());
          localStorage.setItem("principal", userIdentity.getPrincipal().toText());
        }
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/`,
      onSuccess: async () => {
        const userIdentity = authClient.getIdentity();        
        if (userIdentity) {
          setIdentity(userIdentity);
          setIsAuthenticated(true);
          window.location.reload();
        }
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setIsAuthenticated(false);
    setPrincipal(null);
    localStorage.removeItem("principal");
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout, principal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
