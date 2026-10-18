"use client";
import {
  Company,
  companySevice,
  UpdateCompany,
} from "@/services/companyService";
import { useState } from "react";

export function useCompany() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const getCompany = async () => {
    setLoading(true);
    setError(null);

    try {
      const company = await companySevice.getCompany();
      return company;
    } catch (err: any) {
      setError(err.message || "Could not get company");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (data: UpdateCompany) => {
    setLoading(true);
    setError(null);
    try {
      var res = await companySevice.updateCompany(data);
      return res;
    } catch (err: any) {
      setError(err.message || "Could not get company");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const softDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      var res = await companySevice.softDelete();
      return res;
    } catch (err: any) {
      setError(err.message || "Could not soft delete company");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const reactivate = async ()=>{
     setLoading(true);
     setError(null);
     try {
       var res = await companySevice.reactivate();
       return res;
     } catch (err: any) {
       setError(err.message || "Could not reactivate company");
       setLoading(false);
     } finally {
       setLoading(false);
     }
  };

  return {getCompany,updateCompany,softDelete,reactivate}
}
