"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { USER_QUERY_KEY } from "@/lib/hooks/use-current-user";
import { useAuthStore } from "@/lib/store/auth";
import { profileApi } from "../api/profile.api";
import {
    toCandidatePayload,
    type UpdateCandidateProfileFormData,
    updateCandidateProfileFormSchema,
} from "../schemas/profile.schema";

export function useUpdateCandidateProfile(user?: AppUser | null) {
    const userId = useAuthStore((s) => s.userId);
    const queryClient = useQueryClient();

    const form = useForm<UpdateCandidateProfileFormData>({
        resolver: zodResolver(updateCandidateProfileFormSchema),
        defaultValues: {
            current_job_title: "",
            years_of_experience: 0,
            education_level: "",
            desired_annual_salary_min: 0,
            desired_annual_salary_max: 0,
            industry_interest: "",
            match_smart_notification: true,
            skills: [],
            preferred_job_types: [],
        },
    });

    useEffect(() => {
        if (user?.candidate_profile) {
            const cp = user.candidate_profile;
            form.reset({
                current_job_title: cp.current_job_title ?? "",
                years_of_experience: cp.years_of_experience ?? 0,
                education_level: cp.education_level ?? "",
                desired_annual_salary_min: cp.desired_annual_salary_min ?? 0,
                desired_annual_salary_max: cp.desired_annual_salary_max ?? 0,
                industry_interest: cp.industry_interest?.toLowerCase() ?? "",
                match_smart_notification: cp.match_smart_notification ?? true,
                skills: cp.primary_skills ?? [],
                preferred_job_types: cp.preferred_job_types ?? [],
            });
        }
    }, [user, form]);

    const mutation = useMutation({
        mutationFn: (data: UpdateCandidateProfileFormData) =>
            profileApi.updateCandidateProfile(userId!, toCandidatePayload(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] });
        },
    });

    const submit = form.handleSubmit((data) => mutation.mutateAsync(data));

    return { form, submit, isPending: mutation.isPending };
}
