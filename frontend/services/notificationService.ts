import { apiClient } from "@/context/apiClient";

export enum VisitorStatus{
    CheckedIn,
    CheckedOut,
}
export interface Notification {
    id:string;
    visitorName :string;
    status: VisitorStatus;
    isRead:boolean;
    createdAt:string;
}

export const notificationService=  {
    async getAll() : Promise<NotificationDirection[]>{
        return apiClient.get("/api/notification");
    },
    async getOne(companyId:string) : Promise<NotificationDirection>{
        return apiClient.get(`/api/notification/${companyId}`);
    },
    async markRead():Promise<void>{
        return apiClient.patch("/api/notification/mark-read",{});
    },
    async delete():Promise<void>{
        return apiClient.patch("/api/notification",{})
    },
}