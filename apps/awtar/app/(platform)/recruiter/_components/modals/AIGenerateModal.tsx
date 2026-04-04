"use client";

import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AwtarLogo } from "../AwtarLogo";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function AIGenerateModal({ isOpen, onClose }: Props) {
    const [progress, setProgress] = useState(0);

    // Mock progress calculation
    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onClose, 500); // Close automatically after hit 100
                    return 100;
                }
                return prev + 5;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                    <div className="scale-75 origin-left">
                        <AwtarLogo />
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-8 pb-6 flex flex-col items-center text-center">
                    {/* Animated Graphic Placeholder */}
                    <div className="w-24 h-24 relative mb-6">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-ping opacity-20" />
                        <div className="absolute inset-2 rounded-full border border-blue-200 animate-spin-slow" />
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-[0_0_20px_10px_white]">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm rotate-3">
                                ?
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 px-2">
                        Awtar AI is crafting the perfect job description...
                    </h2>
                    <p className="text-gray-500 text-[13px] mb-8 leading-relaxed">
                        Analyzing market trends and required skills to optimize your hiring.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full mb-6">
                        <div className="flex justify-between items-center text-[10px] font-bold text-blue-600 mb-2 px-1">
                            <span>Generating content...</span>
                            <span className="text-gray-400">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Image Block Box */}
                    <div className="w-full h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg mb-6 overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://i.pravatar.cc/500?img=60')] bg-cover bg-center" />
                    </div>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border max-w-[200px] mx-auto border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-3 h-3" strokeWidth={3} /> Cancel Generation
                    </button>
                </div>

                {/* Footer note */}
                <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex justify-center items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Info className="w-3 h-3" />
                    This usually takes about 15-20 seconds.
                </div>
            </div>
        </div>
    );
}
