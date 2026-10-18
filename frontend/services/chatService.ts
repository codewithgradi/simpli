import { apiClient } from "@/context/apiClient";

export interface ChatInterface{
    message : string;
    companyId : string;
}
export const chatService = {
    async chat(data:ChatInterface):Promise<string>{
         
        return apiClient.post(`/api/chat/${data.companyId}`, data.message);
    },
}