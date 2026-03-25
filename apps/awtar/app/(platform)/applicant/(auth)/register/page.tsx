"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/http";
import { toastService } from "@/lib/services/toast.service";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { RegisterProgress } from "./_components/RegisterProgress";
import { Step1AccountDetails } from "./_components/Step1AccountDetails";
import { Step2ProfessionalInfo } from "./_components/Step2ProfessionalInfo";
import { Step3Interests } from "./_components/Step3Interests";
import { useRegister } from "./hooks/use-register";
import { RegisterValidationError } from "./services/register.service";
import {
    parseSalaryInput,
    validateRegisterStep,
    type RegisterApplicantPayload,
    type RegisterFormData,
} from "./schemas/register.schema";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const router = useRouter();
    const registerMutation = useRegister();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");

    const [formData, setFormData] = useState<RegisterFormData>({
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
    });

    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(/\s+/);
        return {
            first_name: parts[0] ?? "",
            last_name: parts.slice(1).join(" ") || "",
        };
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

    const goToNextStep = (currentStep: 1 | 2) => {
        const result = validateRegisterStep(currentStep, formData);
        if (!result.success) {
            setFieldErrors(result.errors);
            return;
        }
        setFieldErrors({});
        setSubmitError("");
        setStep(currentStep === 1 ? 2 : 3);
    };

    const handleComplete = async () => {
        const stepResult = validateRegisterStep(3, formData);
        if (!stepResult.success) {
            setFieldErrors(stepResult.errors);
            toastService.error("Please fix the highlighted fields before submitting.");
            return;
        }

        setFieldErrors({});
        setSubmitError("");

        try {
            await registerMutation.mutateAsync(toApplicantPayload(formData));
            toastService.success("Account created successfully. You can now log in.");
            router.push("/applicant/login");
        } catch (error) {
            if (error instanceof RegisterValidationError) {
                setFieldErrors(error.fieldErrors);
                toastService.error("Please review your details and try again.");
                return;
            }
            if (error instanceof ApiError) {
                const message = error.message || "Failed to create account.";
                setSubmitError(message);
                toastService.error(message);
                return;
            }
            setSubmitError("Something went wrong. Please try again.");
            toastService.error("Something went wrong. Please try again.");
        }
    };

    return (
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col w-full max-w-lg mx-auto">
                <RegisterProgress currentStep={step} />

                <div className="mt-8 flex-1">
                    {step === 1 && (
                        <Step1AccountDetails
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => goToNextStep(1)}
                            errors={fieldErrors}
                        />
                    )}
                    {step === 2 && (
                        <Step2ProfessionalInfo
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => goToNextStep(2)}
                            onBack={() => setStep(1)}
                            errors={fieldErrors}
                        />
                    )}
                    {step === 3 && (
                        <Step3Interests
                            formData={formData}
                            setFormData={setFormData}
                            onBack={() => setStep(2)}
                            onSubmit={handleComplete}
                            errors={fieldErrors}
                            submitError={submitError}
                            isSubmitting={registerMutation.isPending}
                        />
                    )}
                </div>
            </div>
        </AuthSplitLayout>
    );
}
