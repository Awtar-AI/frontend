"use client";

import { Bold, Italic, Link2, List, Redo, Undo } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AIGenerateModal } from "../../_components/modals/AIGenerateModal";
import { DeadlineWarningModal } from "../../_components/modals/DeadlineWarningModal";
import { JobLiveModal } from "../../_components/modals/JobLiveModal";

export default function PostJobPage() {
    const [skills, setSkills] = useState(["Figma", "User Research"]);
    const [skillInput, setSkillInput] = useState("");
    const [workType, setWorkType] = useState("On-site");

    // Modal state
    const [showAIGenerate, setShowAIGenerate] = useState(false);
    const [showJobLive, setShowJobLive] = useState(false);
    const [showDeadlineWarning, setShowDeadlineWarning] = useState(false);

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (indexToRemove: number) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    };

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();

        // Let's pop up the Deadline Warning if they didn't set a future deadline (we will just mock this by randomly deciding or just using a separate button for testing)
        // Since we want to test all states, let's just trigger Success Modal directly on post:
        setShowJobLive(true);
    };

    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <button className="text-blue-600 font-medium text-sm hover:underline">
                    Preview
                </button>
            </div>

            <form
                onSubmit={handlePost}
                className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm"
            >
                <div className="flex flex-col gap-6">
                    {/* Job Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-900">Job Title</label>
                        <input
                            type="text"
                            placeholder='e.g., "UI/UX Designer"'
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all placeholder:text-gray-400"
                            required
                        />
                    </div>

                    {/* Job Description (Rich Text area style) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-900">Job Description</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            {/* Toolbar */}
                            <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4 bg-white">
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <Bold className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <Italic className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <Link2 className="w-4 h-4" />
                                </button>
                                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <Undo className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-900 p-1"
                                >
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Text Area Container */}
                            <div className="relative">
                                <textarea
                                    className="w-full p-4 text-sm outline-none resize-y min-h-[120px] placeholder:text-gray-400"
                                    placeholder="Describe the role, daily tasks, company..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAIGenerate(true)}
                                    className="absolute right-4 top-4 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 border border-blue-100 shadow-sm"
                                >
                                    <span className="text-base leading-none">✨</span> AI Generate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Employment Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">
                                Employment Type
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none">
                                <option>Full-time, Part-time, Contract, Internship</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                        </div>
                        {/* Job Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">Job Category</label>
                            <input
                                type="text"
                                placeholder="e.g., Design, Development"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400"
                            />
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">
                                Experience Level
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none">
                                <option>Entry, Intermediate, Senior</option>
                                <option>Entry</option>
                                <option>Intermediate</option>
                                <option>Senior</option>
                            </select>
                        </div>
                        {/* Job Location */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">Job Location</label>
                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none">
                                <option>City, State, Country</option>
                                <option>New York, USA</option>
                                <option>London, UK</option>
                            </select>
                        </div>

                        {/* Salary Range */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">Salary Range</label>
                            <input
                                type="text"
                                placeholder="Min/Max"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400"
                            />
                        </div>
                        {/* Work Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">Work Type</label>
                            <div className="flex items-center gap-4 h-10">
                                {["On-site", "Remote", "Hybrid"].map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="workType"
                                            checked={workType === type}
                                            onChange={() => setWorkType(type)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600 font-medium">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        {/* Auto-Response Message */}
                        <div className="space-y-2 min-h-full flex flex-col">
                            <label className="text-xs font-bold text-gray-900">
                                Auto-Response Message
                            </label>
                            <textarea
                                placeholder="Thanks for applying..."
                                className="w-full flex-1 min-h-[140px] p-4 text-sm border border-gray-200 rounded-lg outline-none resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Right side group */}
                        <div className="flex flex-col gap-6">
                            {/* Required Skills */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900 flex items-center justify-between">
                                    Required Skills
                                    <button
                                        type="button"
                                        onClick={() => setShowDeadlineWarning(true)}
                                        className="text-[10px] text-red-500 font-normal underline"
                                    >
                                        Test Deadline Warning
                                    </button>
                                </label>
                                <div className="min-h-[46px] p-2 border border-gray-200 rounded-lg flex flex-wrap items-center gap-2 bg-white ring-blue-500 focus-within:ring-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="text-gray-500 hover:text-gray-900 transition-colors"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        className="flex-1 bg-transparent px-2 py-1 outline-none text-sm min-w-[80px]"
                                        placeholder={skills.length === 0 ? "Type and enter..." : ""}
                                    />
                                </div>
                            </div>

                            {/* Application Preferences */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900">
                                    Application Preferences
                                </label>
                                <div className="flex flex-col gap-4 mt-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <input
                                            type="text"
                                            placeholder="Application Deadline"
                                            className="w-1/2 min-w-[160px] px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1">
                                                <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">
                                                Resume Required
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center px-1">
                                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">
                                            Cover Letter Required
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
                    >
                        Post
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-500 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <AIGenerateModal isOpen={showAIGenerate} onClose={() => setShowAIGenerate(false)} />
            <JobLiveModal isOpen={showJobLive} onClose={() => setShowJobLive(false)} />
            <DeadlineWarningModal
                isOpen={showDeadlineWarning}
                onClose={() => setShowDeadlineWarning(false)}
            />
        </div>
    );
}
