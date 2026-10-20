import { analyticsService } from "@/services/analyticsService";
import { useState } from "react";


export function useAnalytics(){
     const [error,setError] = useState<string | null>()
        const [loading,setLoading] = useState(false)
    const getAnalytics = async()=>{
            setLoading(true);
                 setError(null);
                 try {
                   var res = await analyticsService.get();
                   return res;
                 } catch (err: any) {
                   setError(err.message || "Could not get company analytics");
                   setLoading(false);
                 } finally {
                   setLoading(false);
                 }
        };
    return {loading,error, getAnalytics}
}