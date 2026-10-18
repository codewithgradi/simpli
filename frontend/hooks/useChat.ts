"use client";
import { ChatInterface, chatService } from "@/services/chatService";
import { useState } from "react";

export function useChat() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const chat = async (data: ChatInterface) => {
    setLoading(true);
    setError(null);

    try {
      const message = await chatService.chat(data);
      return message;
    } catch (err: any) {
      setError(err.message || "assistant could not give fee back");
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };
}
