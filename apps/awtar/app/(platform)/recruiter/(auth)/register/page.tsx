"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecruiterAuthLayout } from "../../_components/RecruiterAuthLayout";
import { RecruiterRegisterProgress } from "./_components/RegisterProgress";
import { Step1PersonalDetails } from "./_components/Step1PersonalDetails";
import { Step2OrganizationInfo } from "./_components/Step2OrganizationInfo";
import { Step3Verification } from "./_components/Step3Verification";

export interface RecruiterRegisterFormData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    organizationName: string;
    websiteUrl: string;
    industry: string;
    organizationSize: string;
    linkedinUrl: string;
}

export default function RecruiterRegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const router = useRouter();

    const [formData, setFormData] = useState<RecruiterRegisterFormData>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        organizationName: "",
        websiteUrl: "",
        industry: "",
        organizationSize: "",
        linkedinUrl: "",
    });

    const handleComplete = () => {
        // Will connect to backend — mock navigation for now
        console.log("Recruiter registration:", formData);
        router.push("/recruiter/login");
    };

    return (
        <RecruiterAuthLayout>
            <div className="w-full max-w-lg mx-auto">
                <RecruiterRegisterProgress currentStep={step} />

                <div className="mt-6">
                    {step === 1 && (
                        <Step1PersonalDetails
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => setStep(2)}
                        />
                    )}
                    {step === 2 && (
                        <Step2OrganizationInfo
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Verification
                            formData={formData}
                            setFormData={setFormData}
                            onBack={() => setStep(2)}
                            onSubmit={handleComplete}
                        />
                    )}
                </div>
            </div>
        </RecruiterAuthLayout>
    );
}
