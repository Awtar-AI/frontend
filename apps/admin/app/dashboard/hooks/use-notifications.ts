"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";

export const NOTIFICATIONS_QUERY_KEY = ["admin", "notifications"] as const;

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => notificationsApi.getNotifications(false, "user", 5),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
