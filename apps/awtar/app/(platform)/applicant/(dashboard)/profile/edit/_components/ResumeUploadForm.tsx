"use client";

import { CheckCircle2, ExternalLink, FileText, Upload } from "lucide-react";
import { useRef } from "react";

type Props = {
    onUpload: (file: File) => void;
    isPending: boolean;
    currentResumeUrl?: string;
};

const ALLOWED = [".pdf", ".doc", ".docx"];
const MAX_SIZE = 5 * 1024 * 1024;

export function ResumeUploadForm({ onUpload, isPending, currentResumeUrl }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED.includes(ext)) {
            alert("Only PDF, DOC, or DOCX files are allowed.");
            return;
        }
        if (file.size > MAX_SIZE) {
            alert("File must be under 5 MB.");
            return;
        }
        onUpload(file);
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                </span>
                <h3 className="text-base font-black text-gray-950 tracking-tight">Resume</h3>
            </div>

            <div className="p-8">
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => inputRef.current?.click()}
                    className="w-full group relative flex flex-col items-center justify-center gap-4 px-6 py-12 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                            isPending
                                ? "bg-blue-100"
                                : "bg-white border border-slate-200 group-hover:border-blue-200"
                        }`}
                    >
                        {isPending ? (
                            <Upload className="w-6 h-6 text-blue-600 animate-bounce" />
                        ) : (
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-gray-900 mb-1">
                            {isPending ? "Uploading your resume…" : "Drop your resume here"}
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                            PDF, DOC, or DOCX · Max 5 MB
                        </p>
                    </div>
                    {!isPending && (
                        <span className="px-6 py-2.5 bg-white border border-slate-200 group-hover:border-blue-400 group-hover:text-blue-600 text-slate-700 text-xs font-black rounded-xl transition-all shadow-sm">
                            Browse Files
                        </span>
                    )}
                </button>

                {currentResumeUrl && (
                    <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-emerald-800">Resume on file</p>
                            <p className="text-[10px] font-medium text-emerald-600 mt-0.5">
                                Upload a new file to replace it
                            </p>
                        </div>
                        <a
                            href={currentResumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-900 transition-colors shrink-0"
                        >
                            View <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
