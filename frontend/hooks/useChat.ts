"use client";
import { ChatInterface, chatService } from "@/services/chatService";
import { useState } from "react";

export function useChat() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chat = async (
    data: ChatInterface,
    onChunk?: (text: string) => void,
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (onChunk) {
        await chatService.streamChat(data, onChunk);
        return null;
      } else {
        const message = await chatService.chat(data);
        return message;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Assistant could not give feedback";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { chat, loading, error };
}
