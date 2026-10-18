"use client";
import {
  LoginRequest,
  LoginResponse,
  authService,
  RegisterRequest,
} from "@/services/authService";
import { useState } from "react";

export function useAuthService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = async (body: LoginRequest): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(body);
      return user;
    } catch (err: any) {
      setError(err.message || "login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (body: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = authService.register(body);
      return res;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {login,logout,register,error,loading}
}
