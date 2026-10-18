import { apiClient } from "@/context/apiClient";

export interface SystemEmail{
    id:string;
    companyId:string;
    visitorFullname:string;
    roomId:string;
    passcode:string;
    sentAt:Date;
}

export const systemEmailService={
    async getAllEmails():Promise<SystemEmail[]>{
        return apiClient.get("/api/system");
    },
    async getOneEmail():Promise<SystemEmail>{
        return apiClient.get("/api/system/visitor");
    }
}