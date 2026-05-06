"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RecruiterAuthLayout } from "../../_components/RecruiterAuthLayout";
import { RecruiterRegisterProgress } from "./_components/RegisterProgress";
import { Step1PersonalDetails } from "./_components/Step1PersonalDetails";
import { Step2OrganizationInfo } from "./_components/Step2OrganizationInfo";
import { Step3Verification } from "./_components/Step3Verification";
import { useRecruiterRegister } from "./hooks/use-recruiter-register";
import {
    RECRUITER_STEP_FIELDS,
    type RecruiterRegisterFormData,
    recruiterRegisterFormSchema,
} from "./schemas/recruiter-register.schema";

export default function RecruiterRegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const registerMutation = useRecruiterRegister();

    const form = useForm<RecruiterRegisterFormData>({
        resolver: zodResolver(recruiterRegisterFormSchema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            organizationName: "",
            websiteUrl: "",
            industry: "",
            organizationSize: 1,
            linkedinUrl: "",
            businessDocuments: [],
        },
    });

    const goToNextStep = async (currentStep: 1 | 2) => {
        const fields = [...RECRUITER_STEP_FIELDS[currentStep]];
        const isValid = await form.trigger(fields);
        if (isValid) setStep(currentStep === 1 ? 2 : 3);
    };

    const handleComplete = form.handleSubmit((data) => registerMutation.mutate(data));

    return (
        <RecruiterAuthLayout>
            <div className="w-full max-w-lg mx-auto">
                <RecruiterRegisterProgress currentStep={step} />

                <div className="mt-6">
                    {step === 1 && (
                        <Step1PersonalDetails form={form} onNext={() => goToNextStep(1)} />
                    )}
                    {step === 2 && (
                        <Step2OrganizationInfo
                            form={form}
                            onNext={() => goToNextStep(2)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Verification
                            form={form}
                            onBack={() => setStep(2)}
                            onSubmit={handleComplete}
                            isSubmitting={registerMutation.isPending}
                        />
                    )}
                </div>
            </div>
        </RecruiterAuthLayout>
    );
}
