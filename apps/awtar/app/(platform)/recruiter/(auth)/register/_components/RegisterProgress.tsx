import { Check } from "lucide-react";

interface Props {
    currentStep: 1 | 2 | 3;
}

const STEPS = [
    { num: 1, label: "Personal Details" },
    { num: 2, label: "Organization Info" },
    { num: 3, label: "Verification" },
] as const;

export function RecruiterRegisterProgress({ currentStep }: Props) {
    const percentMap = { 1: 33, 2: 66, 3: 100 };
    const percent = percentMap[currentStep];

    const stepLabel =
        currentStep === 1
            ? "STEP 1: PERSONAL DETAILS"
            : currentStep === 2
              ? "STEP 2: ORGANIZATION INFO"
              : "STEP 3: VERIFICATION";

    return (
        <div className="mb-6">
            {/* Top: step indicator + title */}
            <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">
                Step {currentStep} of 3
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-4">
                {currentStep === 1
                    ? "Create recruiter account"
                    : currentStep === 2
                      ? "Organization Info"
                      : "Identity Verification"}
            </h1>

            {/* Step label row + percent */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                    {stepLabel}
                </span>
                <span className="text-xs font-bold text-gray-500">{percent}% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-gray-200 rounded-full mb-3 overflow-hidden">
                <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Breadcrumb — horizontal for step 1 & 3 */}
            {currentStep !== 2 && (
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                    {STEPS.map((step, idx) => {
                        const done = step.num < currentStep;
                        const active = step.num === currentStep;
                        return (
                            <div key={step.num} className="flex items-center gap-1">
                                {idx > 0 && <span className="text-gray-300 mx-0.5">/</span>}
                                <div
                                    className={`flex items-center gap-1 ${
                                        done
                                            ? "text-green-600"
                                            : active
                                              ? "text-blue-600"
                                              : "text-gray-400"
                                    }`}
                                >
                                    {done ? (
                                        <div className="w-4 h-4 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                        </div>
                                    ) : active ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                        </div>
                                    )}
                                    <span className="hidden sm:inline">{step.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
