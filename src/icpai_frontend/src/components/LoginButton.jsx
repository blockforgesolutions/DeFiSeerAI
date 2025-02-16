import React from "react";
import { useAuthClient } from "../auth/useAuthClient";

const LoginButton = () => {
  const { login, isAuthenticated } = useAuthClient();

  if (isAuthenticated) return null;

  return <button onClick={login}>Internet Identity ile Giriş Yap</button>;
};

export default LoginButton;
