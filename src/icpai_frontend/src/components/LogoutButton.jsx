import React from "react";
import { useAuthClient } from "../auth/useAuthClient";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuthClient();

  if (!isAuthenticated) return null;

  return <button onClick={logout}>Çıkış Yap</button>;
};

export default LogoutButton;
