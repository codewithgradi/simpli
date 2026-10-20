import { apiClient } from "@/context/apiClient";

export enum VisitorStatus {
  CheckedIn,
  CheckedOut,
}
export interface Notification {
  id: string;
  visitorName: string;
  status: VisitorStatus;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedObject {
  sortOrder?: string;
  Page?: number;
  SortBy?: string;
  Size?: number;
}

export const notificationService = {
  async getAll(query?: PaginatedObject): Promise<NotificationDirection[]> {
    // If query is undefined, default to empty object
    const safeQuery = query || {};

    const params = new URLSearchParams();

    // Always append parameters with sensible defaults
    params.append("sortOrder", safeQuery.sortOrder || "desc");
    params.append("page", (safeQuery.Page || 1).toString());
    params.append("size", (safeQuery.Size || 10).toString());

    const queryString = params.toString();

    return apiClient.get(`/api/notification?${queryString}`);
  },
  async getOne(companyId: string): Promise<NotificationDirection> {
    return apiClient.get(`/api/notification/${companyId}`);
  },
  async markRead(): Promise<void> {
    return apiClient.patch("/api/notification/mark-read", {});
  },
  async delete(): Promise<void> {
    return apiClient.delete("/api/notification");
  },
};
