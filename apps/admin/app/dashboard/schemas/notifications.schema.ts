import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  email: z.string(),
  module: z.string(),
  is_read: z.boolean(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const parseNotifications = (data: unknown): Notification[] => {
  try {
    const notifications = Array.isArray(data) ? data : [];
    return notifications.map((notif) => notificationSchema.parse(notif));
  } catch {
    return [];
  }
};
