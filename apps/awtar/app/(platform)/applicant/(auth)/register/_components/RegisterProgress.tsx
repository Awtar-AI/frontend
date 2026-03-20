import { Check } from "lucide-react";

export function RegisterProgress({ currentStep }: { currentStep: 1 | 2 | 3 }) {
    const steps = [
        { num: 1, label: "Account Details", sub: "Step 1 of 3" },
        { num: 2, label: "Professional Info", sub: "Step 2 of 3" },
        { num: 3, label: "Interests & Preferences", sub: "Step 3 of 3" },
    ];

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
                        Step {currentStep} of 3
                    </h2>
                    <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">
                        {steps[currentStep - 1].label}
                    </h1>
                </div>
                <span className="text-xs font-medium text-gray-400">
                    {currentStep === 1
                        ? "Next: Professional Info"
                        : currentStep === 2
                          ? "Next Step"
                          : "100% Finalizing"}
                </span>
            </div>

            {/* Progress Bars */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                    />
                ))}
            </div>

            {/* Breadcrumb Steps */}
            {currentStep > 1 && (
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                    <div className="flex items-center gap-1.5 text-green-600">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} /> Account Details
                    </div>
                    <span className="text-gray-300">/</span>
                    {currentStep === 3 ? (
                        <>
                            <div className="flex items-center gap-1.5 text-green-600">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} /> Professional Info
                            </div>
                            <span className="text-gray-300">/</span>
                            <div className="flex items-center gap-1.5 text-blue-600">
                                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                                    3
                                </div>{" "}
                                Interests
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 text-blue-600">
                            <div className="w-4 h-4 rounded-full border-[2px] border-blue-600 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            </div>
                            Professional Info
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
