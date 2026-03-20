import { Award, CheckCircle2, Globe, Info, Linkedin, Mail } from "lucide-react";

export function TrustScoreWidget() {
    const checks = [
        { label: "Identity", passed: true },
        { label: "Employment", passed: true },
        { label: "Education", passed: true },
    ];

    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-blue-600">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Trust Score</h3>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            <div className="flex justify-center mb-10">
                <div className="relative w-[140px] h-[140px] rounded-full border-[10px] border-blue-600 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">92%</span>
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest mt-1 bg-green-100 px-2 py-0.5 rounded-md border border-green-200">
                        Verified
                    </span>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 font-bold text-center mb-8 px-4 leading-relaxed uppercase tracking-wider">
                Candidate's background, identity, and employment history have been officially
                verified.
            </p>

            <div className="space-y-4">
                {checks.map((check) => (
                    <div
                        key={check.label}
                        className="flex items-center justify-between text-xs font-black"
                    >
                        <span className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> {check.label}
                        </span>
                        <span className="text-green-600 tracking-wide">Passed</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AIMatchAnalysis() {
    return (
        <div className="bg-blue-50/50 rounded-[24px] p-8 border border-blue-100/60 shadow-sm border-t-[6px] border-t-blue-400 relative overflow-hidden">
            <h3 className="flex items-center gap-2 text-lg font-black text-blue-900 tracking-tight mb-5">
                <Award className="w-5 h-5 text-blue-600" /> AI Match Analysis
            </h3>
            <p className="text-[13px] text-blue-800 font-medium leading-relaxed mb-8">
                Highly compatible with the{" "}
                <span className="font-black text-blue-900">Senior Frontend Architect</span> role.
                Exhibits strong leadership potential and exceptional expertise in modern JS
                frameworks. Cultural fit score: 98%.
            </p>

            <div className="space-y-6 mb-8">
                <div>
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                        <span className="text-blue-900">Role Compatibility</span>
                        <span className="text-blue-600">96%</span>
                    </div>
                    <div className="h-2 bg-blue-100/80 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full shadow-sm"
                            style={{ width: "96%" }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                        <span className="text-blue-900">Technical Depth</span>
                        <span className="text-blue-600">94%</span>
                    </div>
                    <div className="h-2 bg-blue-100/80 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full shadow-sm"
                            style={{ width: "94%" }}
                        ></div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="w-full py-3.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-transparent font-black text-[13px] rounded-xl transition-all shadow-sm"
            >
                View Detailed AI Report
            </button>
        </div>
    );
}

export function ContactInfoCard() {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Contact Info</h3>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="pt-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                            Email
                        </p>
                        <p className="text-sm font-bold text-gray-900">alex.rivera@example.com</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="pt-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                            Portfolio
                        </p>
                        <p className="text-sm font-bold text-gray-900">arivera-dev.io</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Linkedin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="pt-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                            LinkedIn
                        </p>
                        <p className="text-sm font-bold text-gray-900">/in/alexrivera-tech</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
