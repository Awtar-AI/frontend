import { AlertCircle, CheckCircle2, FileText, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ModalState = "IDLE" | "PROCESSING" | "SUCCESS" | "FAILURE";

export function ResumeModals({
    state,
    onClose,
    onTryAgain,
    onReview,
}: {
    state: ModalState;
    onClose: () => void;
    onTryAgain: () => void;
    onReview: () => void;
}) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "File uploaded successfully",
        "Parsing career history and skills",
        "Finalizing your AI profile",
    ];

    useEffect(() => {
        if (state === "PROCESSING") {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);

            const stepInterval = setInterval(() => {
                setCurrentStep((prev) => (prev < 2 ? prev + 1 : 2));
            }, 1200);

            return () => {
                clearInterval(interval);
                clearInterval(stepInterval);
            };
        } else {
            setProgress(0);
            setCurrentStep(0);
        }
    }, [state]);

    if (state === "IDLE") return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Processing Modal */}
            {state === "PROCESSING" && (
                <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full border-[3px] border-blue-600 flex items-center justify-center mb-6 relative">
                            <FileText className="w-7 h-7 text-blue-600" />
                            <div className="absolute inset-0 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin"></div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2">
                            Processing Resume...
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mb-8">
                            Our AI is analyzing your skills and experience to build your
                            professional profile. This usually takes less than a minute.
                        </p>

                        <div className="w-full space-y-6 mb-10">
                            <div className="flex items-center justify-between text-xs font-bold mb-2">
                                <span className="text-gray-900">Extracting information</span>
                                <span className="text-blue-600">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <div className="space-y-4 pt-4">
                                {steps.map((step) => (
                                    <div key={step} className="flex items-center gap-3">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${steps.indexOf(step) < currentStep ? "bg-green-500 border-green-500" : steps.indexOf(step) === currentStep ? "border-blue-500 border-2" : "border-gray-200"}`}
                                        >
                                            {steps.indexOf(step) < currentStep ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            ) : steps.indexOf(step) === currentStep ? (
                                                <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-bold ${steps.indexOf(step) <= currentStep ? "text-gray-900" : "text-gray-400"}`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-sm rounded-xl transition-all"
                        >
                            Cancel Upload
                        </button>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                            Your data is secure and encrypted.
                        </p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {state === "SUCCESS" && (
                <div className="bg-white rounded-[28px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-8 relative">
                            <Sparkles className="w-10 h-10 text-green-500" />
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-full"></div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            Resume Parsed Successfully!
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed px-4">
                            We've automatically populated your profile with details from your
                            resume. Please review the information below to ensure everything is
                            accurate.
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                type="button"
                                onClick={onReview}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all"
                            >
                                Review Profile
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black rounded-xl transition-all"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <div className="w-3 h-3 border border-gray-300 rounded-[2px] flex items-center justify-center">
                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                                </svg>
                            </div>
                            Your data is processed securely
                        </div>
                    </div>
                </div>
            )}

            {/* Failure Modal */}
            {state === "FAILURE" && (
                <div className="bg-white rounded-[28px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-8 relative">
                            <AlertCircle className="w-10 h-10 text-orange-500" />
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-gray-100">
                                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] text-white">
                                    RB
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            Resume Parsing Failed
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed">
                            We couldn't automatically extract information from your resume. This
                            usually happens with complex layouts, scanned images, or protected PDF
                            files.
                        </p>

                        <div className="flex gap-3 w-full mb-10">
                            <button
                                type="button"
                                onClick={onTryAgain}
                                className="flex-1 py-3.5 border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-black text-[13px] rounded-xl flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" /> Try Another File
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[13px] rounded-xl flex items-center justify-center gap-2 shadow-md"
                            >
                                <RefreshCw className="w-4 h-4" /> Enter Manually
                            </button>
                        </div>

                        <div className="w-full p-6 bg-gray-50 rounded-2xl text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                Troubleshooting
                            </p>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-900">
                                        Resume Formatting Guide
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-500 mt-0.5">
                                        Learn how to optimize your document for AI parsing systems.
                                    </span>
                                </div>
                                <Link
                                    href="/tips/resume-guide"
                                    className="text-blue-600 text-[11px] font-black hover:underline whitespace-nowrap ml-4"
                                >
                                    View Guide &rarr;
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-wider pl-1">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Use PDF
                                    or DOCX
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Standard
                                    Fonts
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
