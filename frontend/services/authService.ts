import { apiClient } from "@/context/apiClient";

export interface LoginRequest{
    email:string;
    password:string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  registrationNumber? :string;
  companyName:string;
  contactNumber: string;
}
export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const authService = {
    async login(body : LoginRequest):Promise<LoginResponse>{
        return apiClient.post("/login",body);
    },
    async logout() :Promise<void>{
        return apiClient.post<void>("/api/auth/logout",{});
    },
    async register(body:RegisterRequest):Promise<void>{
        return apiClient.post("/api/auth/register",body);
    },
    async refresh(refreshToken:string):Promise<LoginResponse>{
        return apiClient.post("/refresh",refreshToken);
    }
}