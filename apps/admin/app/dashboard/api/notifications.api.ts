import http from "@/lib/http";
import type { Notification } from "../schemas/notifications.schema";

export const notificationsApi = {
  async getNotifications(filters?: {
    is_read?: boolean;
    module?: string;
    limit?: number;
  }): Promise<Notification[]> {
    const { data } = await http.get("/api/v1/notifications/", {
      params: {
        is_read: filters?.is_read ?? false,
        module: filters?.module ?? "user",
      },
    });
    return Array.isArray(data) ? data : [];
  },
};
