import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from '@dfinity/principal'
import fetch from 'isomorphic-fetch';
import { canisterId, createActor, idlFactory } from "../../../declarations/icpai_user";

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  principal: string | null;
  userActor: any | null;
  user: any | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [userActor, setUserActor] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();

        const agent = new HttpAgent({
          identity,
          host: "http://127.0.0.1:4943",
          fetch
        });

        // await agent.fetchRootKey();

        const actor = createActor(canisterId, { agent });
        setUserActor(actor);
        setPrincipal(identity.getPrincipal().toString());
        setIsAuthenticated(true)
        await getCurrentUser();

      }
    };
    console.log(userActor);
    
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;

    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic" ? "https://identity.ic0.app/" : "http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:4943/",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943", fetch });
        await agent.fetchRootKey();

        const actor = createActor(canisterId, { agent });
        setUserActor(actor);
        setPrincipal(identity.getPrincipal().toString());
        setIsAuthenticated(true)
      }
    });
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setUserActor(null);
    setIdentity(null);
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  const getCurrentUser = async () => {
    if (!principal) return;
    const response = await userActor.getCurrentUser(Principal.fromText(principal));
    console.log(response);

    if (response && response[0]) {
      setUser(response[0]);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, login, logout, principal, userActor, user }}>
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
