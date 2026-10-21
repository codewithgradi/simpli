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
  message?:string;
}
export interface SendCode{
    email :string;
}
export interface ResetPassword{
    email:string;
    newPassword:string;
    confirmedPassword:string;
    resetCode : number;
}

export const authService = {
    async login(body : LoginRequest):Promise<LoginResponse>{
        return apiClient.post("/api/auth/login",body);
    },
    async logout() :Promise<void>{
        return apiClient.post<void>("/api/auth/logout",{});
    },
    async register(body:RegisterRequest):Promise<void>{
        return apiClient.post("/api/auth/register",body);
    },
    async refresh(refreshToken:string):Promise<LoginResponse>{
        return apiClient.post("/refresh",refreshToken);
    },
    async sendCode(data : SendCode):Promise<void>{
        return apiClient.post("/api/auth/sendCode",data);
    },
    async resetPassword(data:ResetPassword):Promise<void>{
        return apiClient.post("/api/auth/resetpassword",data);
    }
}