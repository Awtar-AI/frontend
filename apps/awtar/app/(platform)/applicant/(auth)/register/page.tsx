"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { RegisterProgress } from "./_components/RegisterProgress";
import { Step1AccountDetails } from "./_components/Step1AccountDetails";
import { Step2ProfessionalInfo } from "./_components/Step2ProfessionalInfo";
import { Step3Interests } from "./_components/Step3Interests";
import { useRegister } from "./hooks/use-register";
import {
    REGISTER_STEP_FIELDS,
    type RegisterFormData,
    registerFormSchema,
} from "./schemas/register.schema";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
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

    const goToNextStep = async (currentStep: 1 | 2) => {
        const fields = [...REGISTER_STEP_FIELDS[currentStep]];
        const isValid = await form.trigger(fields);
        if (isValid) setStep(currentStep === 1 ? 2 : 3);
    };

    const handleComplete = form.handleSubmit((data) => registerMutation.mutate(data));

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
