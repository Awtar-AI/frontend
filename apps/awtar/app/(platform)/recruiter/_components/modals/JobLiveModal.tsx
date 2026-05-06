"use client";

import { CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    jobTitle?: string;
    viewJobsHref?: string;
    dashboardHref?: string;
}

export function JobLiveModal({
    isOpen,
    onClose,
    jobTitle = "New Job Post",
    viewJobsHref = "/recruiter/job-listings",
    dashboardHref = "/recruiter/dashboard",
}: Props) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8 flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        type="submit"
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2.5} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Job is Live!</h2>
                    <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
                        The position has been successfully posted to the job board and is now
                        accepting applications.
                    </p>

                    <div className="w-full bg-gray-50 rounded-xl py-4 mb-8">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            JOB TITLE
                        </p>
                        <p className="text-lg font-bold text-blue-600">{jobTitle}</p>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                router.push(viewJobsHref);
                            }}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-colors text-sm"
                        >
                            View Jobs
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                router.push(dashboardHref);
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-600/20 text-sm"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
