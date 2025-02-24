import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/icpai_user";

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  principal: string | null;
  actor: any
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode })=> {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [actor, setActor] = useState<any>(null);

   useEffect(() => {
    // Initialize AuthClient
    AuthClient.create().then(async (client) => {
      updateClient(client);
    });
  }, []);


  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
      ? "https://identity.ic0.app"
      : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/`,
      onSuccess: async() => {
        
        updateClient(authClient);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient?.logout();
    await updateClient(authClient);
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);

    setAuthClient(client);

    const actor = await createActor(canisterId, {
      agentOptions: {
        identity,
        host:'http://127.0.0.1:4943',
      },
    });

    setActor(actor);
    await actor.signUpWithInternetIdentity();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout, principal, actor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);