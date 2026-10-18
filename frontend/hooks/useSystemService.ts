"use client"
import { systemEmailService } from "@/services/systemService";
import { useState } from "react";

export function useSystemService(){
    const [error,setError] = useState<string | null>()
    const [loading,setLoading] = useState(false)
    const getAllEmails = async()=>{
        setLoading(true);
             setError(null);
             try {
               var res = await systemEmailService.getAllEmails();
               return res;
             } catch (err: any) {
               setError(err.message || "Could not reactivate company");
               setLoading(false);
             } finally {
               setLoading(false);
             }
    };
    const getOneEmail = async()=>{
        setLoading(true);
             setError(null);
             try {
               var res = await systemEmailService.getOneEmail();
               return res;
             } catch (err: any) {
               setError(err.message || "Could not reactivate company");
               setLoading(false);
             } finally {
               setLoading(false);
             }
    };
    return {getAllEmails,getOneEmail,loading,error};
}