"use client";
import {
  LoginRequest,
  LoginResponse,
  authService,
  RegisterRequest,
  SendCode,
  ResetPassword,
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
  const refresh = async (refreshToken: string): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.refresh(refreshToken);
      return user;
    } catch (err: any) {
      setError(err.message || "Please log in again");
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
      const res = await authService.register(body);
      return res;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const sendCode = async (body: SendCode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.sendCode(body);
      return res;
    } catch (err: any) {
      setError(err.message || "failed to send reset code");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (body: ResetPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = authService.resetPassword(body);
      return res;
    } catch (err: any) {
      setError(err.message || "failed to reset password");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {login,logout,register,refresh,sendCode,resetPassword,error,loading}
}
