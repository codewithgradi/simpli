import { apiClient } from "@/context/apiClient";
export interface Room{
    id:string;
    roomNumber:string;
    floor:number;
    type:string;
    status:RoomStatus;
    numberTimesBooked:number;
    companyId:string;
}
export interface UpdateRoom {
  roomNumber: string;
  floor: number;
  type: string;
  status: RoomStatus;
}
export interface PostRoom {
  roomNumber: string;
  floor: number;
}
export enum RoomStatus{
     Available, Occupied, Maintenance
}
export const roomService=  {
    async getAll() : Promise<Room[]>{
        return apiClient.get("/api/room/all");
    },
    async getOne() : Promise<Room>{
        return apiClient.get(`/api/room/`);
    },
    async create(data:PostRoom):Promise<void>{
        return apiClient.put("/api/room",data);
    },
    async update(data:UpdateRoom):Promise<void>{
        return apiClient.post("/api/room",data)
    },
}