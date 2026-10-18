import {apiClient} from "@/context/apiClient"
export enum Gender {
  Male,
  Female,
}

export enum ReasonForVisit {
  Delivery,
  Meeting,
  Maintenance,
  Personal,
}

export enum VisitorStatus {
  CheckedIn,
  CheckedOut,
}

export interface Visitor {
  id: number;
  firstName: string | null;
  lastName: string | null;
  idNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
  reasonForVisit: ReasonForVisit;
  checkInTime: string; 
  checkOutTime: string | null;
  status: VisitorStatus;
  createdAt: string;
  gender: Gender;
  passCode: string | null;
  companyId: number;
  roomId: number;
}
export interface CheckOut{
    passCode:string;
    roomId:string;
}
export interface CheckIn {
  firstName: string;
  lastName: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  roomNumber: string;
  reasonForVisit: ReasonForVisit;
  gender: Gender;
}
export const visitorService=  {
    async getAll() : Promise<Visitor[]>{
        return apiClient.get("/api/visitor");
    },
    async getOne(visitorId:string) : Promise<Visitor>{
        return apiClient.get(`/api/room/${visitorId}`);
    },
    async checkIn(data:CheckIn):Promise<Visitor>{
        return apiClient.put("/api/visitor/check-in",data);
    },
    async checkOut(data:CheckOut):Promise<void>{
        return apiClient.patch("/api/visitor/check-out",data)
    },
}