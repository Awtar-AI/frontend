"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { USER_QUERY_KEY } from "@/lib/hooks/use-current-user";
import { useAuthStore } from "@/lib/store/auth";
import { profileApi } from "../api/profile.api";
import { type UpdateUserPayload, updateUserSchema } from "../schemas/profile.schema";

export function useUpdateUser(user?: AppUser | null) {
    const userId = useAuthStore((s) => s.userId);
    const queryClient = useQueryClient();

    const form = useForm<UpdateUserPayload>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: { first_name: "", last_name: "", email: "" },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });
        }
    }, [user, form]);

    const mutation = useMutation({
        mutationFn: (payload: UpdateUserPayload) => profileApi.updateUser(userId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] });
        },
    });

    const submit = form.handleSubmit((data) => mutation.mutateAsync(data));

    return { form, submit, isPending: mutation.isPending };
}
