import { apiClient } from "@/context/apiClient";
import { LoginRequest } from "./authService";

//getCompany,createCompany,updateCompany,softDeleteCompany, reactivateCompany;

export interface Company{
    id : number;
    companyName : string;
    registrationNumber : string;
    contactNumber : string;
    isProfileComplete : boolean;
    isDeleted : boolean;
    website:string;
    address:AddressContent;
    createdAt:Date;

}
export interface AddressContent{
    streetNumber:string;
    streetName:string;
    city:string;
    country:string;
}

export interface UpdateCompany{
    companyName : string;
    registrationNumber : string;
    contactNumber : string;
    website:string;
    address:AddressContent;
}
export interface UpdateCompanyResponse{
  companyName: string ;
  registrationNumber: string; 
  contactNumber: string;
  address: AddressContent;
  website: string;
}
export interface ReactivateResponse {
    message :string;
}
export const companySevice=  {
    async getCompany() : Promise<Company>{
        return apiClient.get("/api/company");
    },
    async updateCompany(data:UpdateCompany):Promise<UpdateCompanyResponse>{
        return apiClient.put("/api/company",data);
    },
    async softDelete():Promise<void>{
        return apiClient.patch("/api/company/soft-delete",{})
    },
    async reactivate(data:LoginRequest):Promise<ReactivateResponse>{
        return apiClient.patch("/api/company/reactivate",data)
    }
}