import { AlertCircle, Check } from "lucide-react";
import Link from "next/link";

export function ProfileCompletionWidget() {
    const steps = [
        { label: "Basic Information", completed: true },
        { label: "Work Experience", completed: true },
        { label: "Education", completed: true },
        { label: "Skill & Certification", completed: false },
        { label: "Portfolio & Projects", completed: false },
        { label: "Professional Photo", completed: true },
        { label: "Resume Upload", completed: false },
    ];

    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Profile Completion
                </h3>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-black rounded-lg">
                    57%
                </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-3 tracking-wide">
                <span>4 of 7 completed</span>
                <span className="text-gray-900">57%</span>
            </div>

            <div className="h-2.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width: "57%" }}></div>
            </div>

            <div className="space-y-4 mb-8">
                {steps.map((step) => (
                    <div key={step.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-[6px] flex items-center justify-center ${step.completed ? "bg-green-500" : "border-2 border-gray-200 bg-white"}`}
                            >
                                {step.completed && (
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />
                                )}
                            </div>
                            <span
                                className={`text-sm font-bold ${step.completed ? "text-gray-900" : "text-gray-400"}`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {!step.completed && (
                            <span className="text-[10px] font-black text-gray-900 tracking-wide">
                                Complete
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-orange-50/50 border border-orange-200/60 rounded-2xl p-5 flex gap-3 items-start mb-6">
                <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-orange-800 leading-relaxed">
                    Complete your profile to get better job matches and increase your visibility to
                    recruiters.
                </p>
            </div>

            <Link
                href="/applicant/profile/edit"
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-colors text-center block"
            >
                Complete Profile
            </Link>
        </div>
    );
}
