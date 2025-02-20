import React from "react";
import { useAuthClient } from "../hooks/useAuthClient";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

const LoginLogoutButton = () => {
  const { login, isAuthenticated, logout } = useAuthClient();

  if (isAuthenticated) return <Button onClick={logout}> <LogOut /> Sign Out</Button>;;

  return <Button onClick={login}><LogIn /> Sign in with Internet Identity</Button>;
};

export default LoginLogoutButton;
