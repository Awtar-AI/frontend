"use client";

import { CheckCircle2, FileText, Upload } from "lucide-react";
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
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                <Upload className="w-5 h-5 text-blue-600" /> Resume
            </h3>

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
                className="w-full border-2 border-dashed border-gray-200 rounded-[20px] p-10 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer disabled:opacity-50"
            >
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Upload className="w-6 h-6" />
                </div>
                <p className="text-[15px] font-black text-gray-900 mb-1">
                    {isPending ? "Uploading..." : "Drop your resume here"}
                </p>
                <p className="text-[11px] font-bold text-gray-400">PDF, DOC, or DOCX (Max 5 MB)</p>
                <span className="mt-8 px-8 py-3 bg-white border-2 border-gray-100 group-hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-all shadow-sm inline-block">
                    Browse Files
                </span>
            </button>

            {currentResumeUrl && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-green-800 uppercase tracking-wide">
                            Current resume on file
                        </span>
                    </div>
                    <a
                        href={currentResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-green-700 hover:underline shrink-0"
                    >
                        <FileText className="w-3.5 h-3.5" /> View
                    </a>
                </div>
            )}
        </div>
    );
}
