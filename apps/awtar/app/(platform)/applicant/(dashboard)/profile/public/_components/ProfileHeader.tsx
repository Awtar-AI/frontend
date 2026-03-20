import { Briefcase, Download, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export function ProfileHeader() {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Subtle blue accent top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                <div className="relative w-28 h-28 rounded-2xl border-4 border-white shadow-lg shrink-0 overflow-hidden bg-gray-100">
                    <Image
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Alex Rivera"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Alex Rivera
                        </h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg w-fit mx-auto md:mx-0 border border-green-200/60">
                            <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                    </div>

                    <p className="text-lg font-bold text-gray-600 mb-4">
                        Senior Full Stack Engineer
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400" /> San Francisco, CA
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-gray-400" /> 8+ Years Experience
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                            <Sparkles className="w-4 h-4" /> Open to roles
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] flex items-center justify-center gap-2 shrink-0"
            >
                <Download className="w-4 h-4" /> Resume
            </button>
        </div>
    );
}
