import { Bell, Briefcase, Building2, DollarSign, Lock } from "lucide-react";
import type { RegisterFormData } from "../page";

export function Step3Interests({
    formData,
    setFormData,
    onBack,
    onSubmit,
}: {
    formData: RegisterFormData;
    setFormData: (data: RegisterFormData) => void;
    onBack: () => void;
    onSubmit: () => void;
}) {
    const jobTypesOptions = ["Full-time", "Part-time", "Remote", "Contract"];
    const industriesOptions = ["Technology", "Fintech", "Healthcare", "E-commerce", "Education"];

    const toggleJobType = (type: string) => {
        if (formData.jobTypes.includes(type)) {
            setFormData({ ...formData, jobTypes: formData.jobTypes.filter((t) => t !== type) });
        } else {
            setFormData({ ...formData, jobTypes: [...formData.jobTypes, type] });
        }
    };

    const toggleIndustry = (ind: string) => {
        if (formData.industries.includes(ind)) {
            setFormData({ ...formData, industries: formData.industries.filter((i) => i !== ind) });
        } else {
            setFormData({ ...formData, industries: [...formData.industries, ind] });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <form
                className="space-y-8 bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <fieldset className="space-y-4">
                    <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 tracking-tight">
                        <Briefcase className="w-4 h-4 text-blue-600" aria-hidden="true" /> Preferred
                        Job Types
                    </legend>
                    <div className="grid grid-cols-4 gap-3">
                        {jobTypesOptions.map((type) => {
                            const selected = formData.jobTypes.includes(type);
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => toggleJobType(type)}
                                    className={`py-2.5 px-2 text-sm font-bold rounded-xl transition-all border ${selected ? "border-blue-600 text-blue-700 bg-blue-50/50 shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"}`}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                <div className="space-y-4">
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-900 tracking-tight">
                        <DollarSign className="w-4 h-4 text-blue-600" aria-hidden="true" /> Desired
                        Annual Salary Range
                    </span>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="minSalary"
                                className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1"
                            >
                                MINIMUM (USD)
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                                <span className="text-gray-400 font-bold">$</span>
                                <input
                                    id="minSalary"
                                    type="text"
                                    value={formData.minSalary}
                                    onChange={(e) =>
                                        setFormData({ ...formData, minSalary: e.target.value })
                                    }
                                    className="w-full bg-transparent outline-none font-bold text-gray-700"
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="maxSalary"
                                className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1"
                            >
                                MAXIMUM (USD)
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                                <span className="text-gray-400 font-bold">$</span>
                                <input
                                    id="maxSalary"
                                    type="text"
                                    value={formData.maxSalary}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maxSalary: e.target.value })
                                    }
                                    className="w-full bg-transparent outline-none font-bold text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <fieldset className="space-y-4">
                    <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 tracking-tight">
                        <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" /> Industry
                        Interests
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                        {industriesOptions.map((ind) => {
                            const selected = formData.industries.includes(ind);
                            return (
                                <button
                                    key={ind}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => toggleIndustry(ind)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border shadow-sm ${selected ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
                                >
                                    {ind}{" "}
                                    <span
                                        className={`ml-1 ${selected ? "text-blue-200" : "text-gray-400"}`}
                                    >
                                        {selected ? "×" : "+"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                <div className="p-5 bg-blue-50/30 border border-blue-100 rounded-[16px] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <h4 className="font-bold text-gray-900 text-sm">
                            Smart Match Notifications
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed mt-1 mb-4">
                            We'll notify you as soon as a role matches your salary and type
                            preferences. You can adjust this later.
                        </p>
                        <button
                            id="smart-match-toggle"
                            type="button"
                            role="switch"
                            aria-checked={formData.smartMatch}
                            className="inline-flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                                setFormData({ ...formData, smartMatch: !formData.smartMatch });
                            }}
                        >
                            <div
                                className={`relative w-11 h-6 rounded-full shadow-inner transition-colors ${formData.smartMatch ? "bg-blue-600" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition transform shadow-sm ${formData.smartMatch ? "translate-x-5" : "translate-x-0"}`}
                                ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700">
                                Enable instant matches
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-2 py-2 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Previous Step
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                    >
                        Complete Registration &rarr;
                    </button>
                </div>
            </form>

            <p className="text-xs text-center text-gray-400 font-medium mt-6">
                <Lock className="w-3 h-3 inline pb-[2px] mr-1" aria-hidden="true" /> Your
                preferences are kept private and only shared with verified employers you apply to.
            </p>
        </div>
    );
}
