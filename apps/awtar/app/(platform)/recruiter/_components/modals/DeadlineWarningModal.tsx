"use client";

import { AlertTriangle, CalendarX2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function DeadlineWarningModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 relative">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" strokeWidth={2.5} />
                    </div>

                    <div className="w-full bg-[#FCFAF0] border border-orange-100 rounded-xl p-6 mb-6 flex justify-center">
                        <CalendarX2 className="w-8 h-8 text-blue-200" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Application Deadline Passed
                    </h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        The application deadline for this job posting has already passed. Please set
                        a date in the future to edit or publish this role.
                    </p>

                    <div className="w-full flex flex-col gap-2 relative">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] flex items-center justify-center gap-2 text-sm"
                        >
                            <CalendarX2 className="w-4 h-4" /> Update Deadline
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-transparent hover:bg-gray-50 text-gray-600 font-bold rounded-lg transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
