"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/http";
import { toastService } from "@/lib/services/toast.service";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { RegisterProgress } from "./_components/RegisterProgress";
import { Step1AccountDetails } from "./_components/Step1AccountDetails";
import { Step2ProfessionalInfo } from "./_components/Step2ProfessionalInfo";
import { Step3Interests } from "./_components/Step3Interests";
import { useRegister } from "./hooks/use-register";
import {
    parseSalaryInput,
    REGISTER_STEP_FIELDS,
    type RegisterApplicantPayload,
    type RegisterFormData,
    registerFormSchema,
} from "./schemas/register.schema";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const router = useRouter();
    const registerMutation = useRegister();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            jobTitle: "",
            experience: 0,
            skills: [],
            education: "",
            resume: null,
            jobTypes: [],
            minSalary: "",
            maxSalary: "",
            industries: [],
            smartMatch: true,
        },
    });

    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(/\s+/);
        return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") || "" };
    };

    const toApplicantPayload = (data: RegisterFormData): RegisterApplicantPayload => {
        const names = splitName(data.fullName);
        const minSalary = parseSalaryInput(data.minSalary);
        const maxSalary = parseSalaryInput(data.maxSalary);

        return {
            email: data.email.trim(),
            first_name: names.first_name,
            last_name: names.last_name,
            password: data.password,
            role: "candidate",
            current_job_title: data.jobTitle.trim(),
            years_of_experience: data.experience,
            primary_skills: data.skills.join(","),
            education_level: data.education as RegisterApplicantPayload["education_level"],
            preferred_job_types: data.jobTypes as RegisterApplicantPayload["preferred_job_types"],
            desired_annual_salary_min: Number.isNaN(minSalary) ? undefined : minSalary,
            desired_annual_salary_max: Number.isNaN(maxSalary) ? undefined : maxSalary,
            industry_interest:
                (data.industries[0] as RegisterApplicantPayload["industry_interest"]) ?? undefined,
            match_smart_notification: data.smartMatch,
            resume: data.resume ?? undefined,
        };
    };

    const goToNextStep = async (currentStep: 1 | 2) => {
        const fields = [...REGISTER_STEP_FIELDS[currentStep]];
        const isValid = await form.trigger(fields);
        if (isValid) setStep(currentStep === 1 ? 2 : 3);
    };

    const handleComplete = form.handleSubmit(async (data) => {
        try {
            await registerMutation.mutateAsync(toApplicantPayload(data));
            toastService.success("Account created successfully. You can now log in.");
            router.push("/applicant/login");
        } catch (error) {
            if (error instanceof ApiError) {
                const message = error.message || "Failed to create account.";
                form.setError("root", { message });
                toastService.error(message);
                return;
            }
            const fallback = "Something went wrong. Please try again.";
            form.setError("root", { message: fallback });
            toastService.error(fallback);
        }
    });

    return (
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col w-full max-w-lg mx-auto">
                <RegisterProgress currentStep={step} />

                <div className="mt-8 flex-1">
                    {step === 1 && (
                        <Step1AccountDetails form={form} onNext={() => goToNextStep(1)} />
                    )}
                    {step === 2 && (
                        <Step2ProfessionalInfo
                            form={form}
                            onNext={() => goToNextStep(2)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Interests
                            form={form}
                            onBack={() => setStep(2)}
                            onSubmit={handleComplete}
                            isSubmitting={registerMutation.isPending}
                        />
                    )}
                </div>
            </div>
        </AuthSplitLayout>
    );
}
