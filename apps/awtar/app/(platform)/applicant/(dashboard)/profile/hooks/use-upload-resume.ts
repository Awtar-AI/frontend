"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { USER_QUERY_KEY } from "@/lib/hooks/use-current-user";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";
import { profileApi } from "../api/profile.api";

export function useUploadResume() {
    const userId = useAuthStore((s) => s.userId);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (file: File) => profileApi.uploadResume(userId!, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] });
            toastService.success("Resume uploaded.");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    return {
        upload: (file: File) => mutation.mutate(file),
        isPending: mutation.isPending,
    };
}
