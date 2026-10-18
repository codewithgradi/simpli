"use client"
import { notificationService } from "@/services/notificationService";
import { useState } from "react";

export function useNotification (){
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);

    const getAll = async () => {
        setLoading(true);
        setError(null);
        try {
          var res = await notificationService.getAll();
          return res;
        } catch (err: any) {
          setError(err.message || "Could not get notifications");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    const getone = async (companyId:string) => {
        setLoading(true);
        setError(null);
        try {
          var res = await notificationService.getOne(companyId);
          return res;
        } catch (err: any) {
          setError(err.message || "Could not get notification");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    const deleteNotifactions = async () => {
        setLoading(true);
        setError(null);
        try {
          var res = await notificationService.delete();
          return res;
        } catch (err: any) {
          setError(err.message || "Could not delete notifications");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    const markAllRead = async () => {
        setLoading(true);
        setError(null);
        try {
          var res = await notificationService.markRead();
          return res;
        } catch (err: any) {
          setError(err.message || "Could not notifications as read");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      return {deleteNotifactions,error,loading,markAllRead,getAll,getone}

}