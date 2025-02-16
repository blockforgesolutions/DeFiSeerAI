import { useAuth } from "./AuthProvider";

export const useAuthClient = () => {
  const { isAuthenticated, identity, login, logout } = useAuth();

  return { isAuthenticated, identity, login, logout };
};
