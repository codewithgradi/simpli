import { PaginatedObject } from "@/services/notificationService";
import { CheckIn, CheckOut, visitorService } from "@/services/visitorService";
import { useState } from "react";

export function useVisitor(){
      const [error, setError] = useState<string | null>();
      const [loading, setLoading] = useState(false);
    
      const getVisitors = async (query?:PaginatedObject) => {
        setLoading(true);
        setError(null);
    
        try {
          const visitors = await visitorService.getAll(query);
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
    
      const checkin = async (data: CheckIn, roomId:string) => {
        setLoading(true);
        setError(null);
        try {
          var res = await visitorService.checkIn(data, roomId);
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
          throw err;
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