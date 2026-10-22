import { apiClient } from "@/context/apiClient";
import { PaginatedObject } from "./notificationService";
export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  status: RoomStatus;
  numberOfTimesBooked: number;
  companyId: string;
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
    async getAll(companyId :string, query? :PaginatedObject) : Promise<Room[]>{
            const safeQuery = query || {};

            const params = new URLSearchParams();

            params.append("sortOrder", safeQuery.sortOrder || "desc");
            params.append("page", (safeQuery.Page || 1).toString());
            params.append("size", (safeQuery.Size || 10).toString());
            params.append("isAvailable", (safeQuery.isRoomAvailable? "true":"false"))

            const queryString = params.toString();

            return apiClient.get(`/api/room/public/all?CmpId=${companyId}&${queryString}`);

    },
    async  getAllPrivate(query? : PaginatedObject): Promise<Room[]> {
            const safeQuery = query || {};

            const params = new URLSearchParams();

            // Always append parameters with sensible defaults
            params.append("sortOrder", safeQuery.sortOrder || "desc");
            params.append("page", (safeQuery.Page || 1).toString());
            params.append("size", (safeQuery.Size || 10).toString());

            const queryString = params.toString();

            return apiClient.get(`/api/room/company/all?${queryString}`);

    },
    async getOne() : Promise<Room>{
        return apiClient.get(`/api/room/`);
    },
    async create(data:PostRoom):Promise<void>{
        return apiClient.post("/api/room",data);
    },
    async update(data:UpdateRoom, id:number):Promise<void>{
        return apiClient.put(`/api/room?Ri=${id}`,data)
    },
}