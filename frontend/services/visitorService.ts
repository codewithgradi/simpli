import { apiClient } from "@/context/apiClient";
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
export interface CheckOut {
  passCode: string;
  roomId: number;
  companyId?:number;
}
export interface CheckIn {
  companyId: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  roomNumber: string;
  reasonForVisit: ReasonForVisit;
  gender: Gender;
}
export interface PaginatedObject {
  sortOrder?: string;
  Page?: number;
  SortBy?: string;
  Size?: number;
}
export interface CheckOutResponse{
  message : string;
}
export const visitorService = {
  async getAll(query?: PaginatedObject): Promise<Visitor[]> {
    const params = new URLSearchParams();

    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);
    if (query?.Page) params.append("page", query.Page.toString());
    if (query?.Size) params.append("size", query.Size.toString());

    const queryString = params.toString();
    return apiClient.get(`/api/visitor${queryString ? `?${queryString}` : ""}`);
  },
  async getOne(visitorId: string): Promise<Visitor> {
    return apiClient.get(`/api/room/${visitorId}`);
  },
  async checkIn(data: CheckIn, roomId: string): Promise<Visitor> {
    return apiClient.post(`/api/visitor/check-in?RoomId=${roomId}`, data);
  },
  async checkOut(data: CheckOut): Promise<CheckOutResponse> {
      return await apiClient.patch(`/api/visitor/check-out`, data);
  },
};
