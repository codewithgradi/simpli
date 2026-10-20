import { apiClient } from "@/context/apiClient";

export interface ChatInterface {
  message: string;
  companyId: string;
}

export const chatService = {
  async chat(data: ChatInterface): Promise<any> {
    // Pass an object as the body so it serializes correctly into JSON
    const response = await apiClient.post(`/api/chat/${data.companyId}`, {
      message: data.message,
      request: data.message, // Includes both in case the backend binds to 'request'
    });

    // Return response data or reply depending on your apiClient wrapper
    return response;
  },
};
