import { useAuth } from "./AuthProvider";

export const useAuthClient = () => {
  const auth = useAuth();
  if (!auth) {
    throw new Error("Auth context is null");
  }
  const { isAuthenticated, identity, login, logout, principal } = auth;

  return { isAuthenticated, identity, login, logout, principal };
};