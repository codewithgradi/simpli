import { apiClient, API_BASE_URL } from "@/context/apiClient";
import Cookies from "js-cookie";

export interface ChatInterface {
  message: string;
  companyId: string;
}

const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = Cookies.get("jwt") || Cookies.get("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const chatService = {
  async chat(data: ChatInterface): Promise<any> {
    const response: any = await apiClient.post(`/api/chat/${data.companyId}`, {
      message: data.message,
      request: data.message,
    });
    return response?.reply || response?.message || response;
  },

  async streamChat(
    data: ChatInterface,
    onChunk: (text: string) => void,
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/chat/${data.companyId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message: data.message,
        request: data.message,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || "Could not process chat request.");
    }

    const json = await response.json();
    const replyText = json?.reply || json?.message || JSON.stringify(json);

    // Simulate smooth streaming typewriter effect for a friendly UI
    const chunkSize = 4;
    for (let i = 0; i < replyText.length; i += chunkSize) {
      const chunk = replyText.slice(i, i + chunkSize);
      onChunk(chunk);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
  },
};
