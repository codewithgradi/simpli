import { CheckIn, CheckOut, visitorService } from "@/services/visitorService";
import { useState } from "react";

export function useVisitor(){
      const [error, setError] = useState<string | null>();
      const [loading, setLoading] = useState(false);
    
      const getVisitors = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const visitors = await visitorService.getAll();
          return visitors;
        } catch (err: any) {
          setError(err.message || "Could not get visitors");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    
      const getVisitor = async (companyId:string) => {
        setLoading(true);
        setError(null);
    
        try {
          const visitor = await visitorService.getOne(companyId);
          return visitor;
        } catch (err: any) {
          setError(err.message || "Could not get visitor");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    
      const checkin = async (data: CheckIn) => {
        setLoading(true);
        setError(null);
        try {
          var res = await visitorService.checkIn(data);
          return res;
        } catch (err: any) {
          setError(err.message || "Could not check in");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    
      const checkout = async (data: CheckOut) => {
        setLoading(true);
        setError(null);
        try {
          var res = await visitorService.checkOut(data);
          return res;
        } catch (err: any) {
          setError(err.message || "Could not check out");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
    
      return {
        getVisitors,
        checkin,
        checkout,
        loading,
        error,
        getVisitor,
      };
}