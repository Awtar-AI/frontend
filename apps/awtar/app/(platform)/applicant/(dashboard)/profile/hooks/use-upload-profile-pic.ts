"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { USER_QUERY_KEY } from "@/lib/hooks/use-current-user";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";
import { profileApi } from "../api/profile.api";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function useUploadProfilePic() {
    const userId = useAuthStore((s) => s.userId);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (file: File) => profileApi.uploadProfilePic(userId!, file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] });
            toastService.success(data.message ?? "Profile picture updated.");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    function upload(file: File) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            toastService.error("Only PNG, JPG, and WebP images are allowed.");
            return;
        }
        mutation.mutate(file);
    }

    return { upload, isPending: mutation.isPending };
}
