"use client";

import {
    ArrowRight,
    Briefcase,
    Calendar,
    CheckCircle2,
    DollarSign,
    Edit3,
    Eye,
    FileText,
    HelpCircle,
    MapPin,
    Paperclip,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { mockJobs, mockUser } from "../../../lib/mockData";
import type { JobPost } from "../../../types";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const job = mockJobs.find((j: JobPost) => j.id === resolvedParams.id) || mockJobs[0];

    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else router.push("/applicant/applications"); // Final submission redirect
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="p-8 lg:p-10 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* 3-Step Stepper */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex items-center justify-center max-w-4xl mx-auto">
                <div className="flex items-center w-full">
                    {[
                        { id: 1, label: "Review Profile" },
                        { id: 2, label: "Questions" },
                        { id: 3, label: "Submission" },
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                        step >= s.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                </div>
                                <span
                                    className={`text-sm font-black whitespace-nowrap ${step >= s.id ? "text-blue-600" : "text-gray-400"}`}
                                >
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div
                                    className={`h-[2px] mx-6 flex-1 transition-colors ${step > s.id ? "bg-blue-600" : "bg-gray-100"}`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Column: Form Content */}
                <div className="xl:col-span-8 flex flex-col gap-8">
                    <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm space-y-10">
                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        Step 1: Review Profile
                                    </h2>
                                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-md uppercase tracking-wider border border-gray-100 italic">
                                        Draft Saved
                                    </span>
                                </div>

                                {/* Contact Info */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            Contact Information
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 border border-transparent hover:border-blue-100 rounded-2xl transition-all">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                Full Name
                                            </p>
                                            <p className="text-sm font-black text-gray-900">
                                                {mockUser.name}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-transparent hover:border-blue-100 rounded-2xl transition-all">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                Email Address
                                            </p>
                                            <p className="text-sm font-black text-gray-900">
                                                abebe.bikila@example.com
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Cover Letter */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-900 tracking-tight">
                                        Cover Letter
                                    </h3>
                                    <textarea
                                        rows={8}
                                        placeholder="Explain why you are the best candidate for this role..."
                                        className="w-full p-6 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none hover:border-gray-200 transition-all font-medium text-sm text-gray-600 resize-none"
                                    />
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-blue-600 text-xs font-black hover:underline bg-blue-50 px-4 py-3 rounded-xl"
                                    >
                                        <Paperclip className="w-4 h-4" /> Attach File
                                    </button>
                                </section>

                                {/* Resume & Documents */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-gray-900 tracking-tight">
                                            Resume & Documents
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1"
                                        >
                                            <Edit3 className="w-4 h-4" /> Replace
                                        </button>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-inner">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">
                                                    Abebe_Bikila_CV_2024.pdf
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    Uploaded on Oct 12, 2023 • 1.2 MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </section>

                                {/* Key Skills */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-900 tracking-tight">
                                        Key Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {["Python", "React.js", "AWS", "TensorFlow", "Docker"].map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 text-[11px] font-black rounded-xl border border-blue-100 uppercase tracking-wider shadow-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ),
                                        )}
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-50 text-gray-400 text-[11px] font-black rounded-xl border border-transparent hover:border-gray-200 transition-all"
                                        >
                                            + Add Skill
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    Step 2: Screening Questions
                                </h2>
                                <div className="space-y-8">
                                    {[
                                        "How many years of experience do you have with Go?",
                                        "What is your notice period?",
                                        "Tell us about a time you solved a complex production issue.",
                                    ].map((item, i) => (
                                        <div key={item} className="space-y-4">
                                            <p className="text-sm font-black text-gray-900">
                                                {i + 1}. {item}
                                            </p>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium text-gray-600 transition-all outline-none"
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300 text-center py-10">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-100/50">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    Ready to Submit!
                                </h2>
                                <p className="text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                                    Your profile and screening answers are all set. Review
                                    everything one last time before submitting your application to{" "}
                                    {job.company}.
                                </p>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left max-w-md mx-auto space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Summary
                                    </h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-gray-500 tracking-tight">
                                            Position
                                        </span>
                                        <span className="font-black text-gray-900">
                                            {job.title}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-gray-500 tracking-tight">
                                            Location
                                        </span>
                                        <span className="font-black text-gray-900">
                                            {job.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-10">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`px-8 py-3.5 border-2 border-gray-100 hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-all ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
                            >
                                Back
                            </button>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="px-8 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-sm rounded-xl transition-all"
                                >
                                    Save for Later
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {step === 3
                                        ? "Submit Application"
                                        : `Next: ${step === 1 ? "Questions" : "Submission"}`}{" "}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Collapsed Step Preview from Image 3 */}
                    {step === 1 && (
                        <div className="bg-gray-50/50 rounded-[24px] p-6 border border-gray-100 flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-black">
                                    2
                                </div>
                                <span className="text-sm font-black text-gray-400">
                                    Step 2: Screening Questions
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Job Summary Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Job Sticky Summary */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
                        <div className="h-40 bg-[#F0F4F8] relative">
                            {/* Visual element (placeholder for the office image in screenshot) */}
                            <div className="absolute inset-0 bg-blue-600/5 mix-blend-multiply"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-8 text-center md:text-left">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                                    {job.title}
                                </h3>
                                <p className="text-sm font-black text-blue-600 tracking-tight underline cursor-pointer">
                                    {job.company}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                    <MapPin className="w-4 h-4 text-gray-300" /> {job.location}{" "}
                                    (Remote)
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                    <DollarSign className="w-4 h-4 text-gray-300" /> {job.salary} •
                                    Full-time
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                    <Calendar className="w-4 h-4 text-gray-300" /> Posted 2 days ago
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                                        <Image
                                            src="https://i.pravatar.cc/100?img=11"
                                            alt="Hiring Manager"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                            Hiring Manager
                                        </p>
                                        <p className="text-sm font-black text-gray-900">
                                            Sara Tadesse
                                        </p>
                                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                                            Tech Lead
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-2xl flex items-start gap-4">
                                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-gray-900">
                                            Need assistance?
                                        </p>
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Check our{" "}
                                            <span className="text-blue-600 font-black cursor-pointer underline">
                                                FAQ
                                            </span>{" "}
                                            or contact recruitment support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
