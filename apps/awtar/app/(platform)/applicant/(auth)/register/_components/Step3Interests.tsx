import { Bell, Briefcase, Building2, DollarSign, Lock } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormData } from "../schemas/register.schema";

type Props = {
    form: UseFormReturn<RegisterFormData>;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
};

export function Step3Interests({ form, onBack, onSubmit, isSubmitting }: Props) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const jobTypes = watch("jobTypes");
    const industries = watch("industries");
    const smartMatch = watch("smartMatch");

    const jobTypesOptions = [
        { value: "full_time", label: "Full-time" },
        { value: "part_time", label: "Part-time" },
        { value: "contract", label: "Contract" },
        { value: "internship", label: "Internship" },
        { value: "temporary", label: "Temporary" },
    ];
    const industriesOptions = ["Tech", "Finance", "Healthcare", "Education", "Other"];

    const toggleJobType = (type: string) => {
        const next = jobTypes.includes(type)
            ? jobTypes.filter((t) => t !== type)
            : [...jobTypes, type];
        setValue("jobTypes", next, { shouldValidate: true });
    };

    const toggleIndustry = (ind: string) => {
        setValue("industries", industries.includes(ind) ? [] : [ind], { shouldValidate: true });
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
                            const selected = jobTypes.includes(type.value);
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => toggleJobType(type.value)}
                                    className={`py-2.5 px-2 text-sm font-bold rounded-xl transition-all border ${selected ? "border-blue-600 text-blue-700 bg-blue-50/50 shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"}`}
                                >
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                    {errors.jobTypes && (
                        <p className="text-xs text-red-600">{errors.jobTypes.message}</p>
                    )}
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
                                MINIMUM (ETB)
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-2 hover:border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                                <span className="text-gray-400 font-bold">$</span>
                                <input
                                    id="minSalary"
                                    type="text"
                                    {...register("minSalary")}
                                    className="w-full bg-transparent outline-none font-bold text-gray-700"
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="maxSalary"
                                className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1"
                            >
                                MAXIMUM (ETB)
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center gap-2 hover:border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                                <span className="text-gray-400 font-bold">$</span>
                                <input
                                    id="maxSalary"
                                    type="text"
                                    {...register("maxSalary")}
                                    className="w-full bg-transparent outline-none font-bold text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                    {errors.minSalary && (
                        <p className="text-xs text-red-600">{errors.minSalary.message}</p>
                    )}
                    {errors.maxSalary && (
                        <p className="text-xs text-red-600">{errors.maxSalary.message}</p>
                    )}
                </div>

                <fieldset className="space-y-4">
                    <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 tracking-tight">
                        <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" /> Industry
                        Interests
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                        {industriesOptions.map((ind) => {
                            const selected = industries.includes(ind);
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
                    {errors.industries && (
                        <p className="text-xs text-red-600">{errors.industries.message}</p>
                    )}
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
                            We&apos;ll notify you as soon as a role matches your salary and type
                            preferences. You can adjust this later.
                        </p>
                        <button
                            id="smart-match-toggle"
                            type="button"
                            role="switch"
                            aria-checked={smartMatch}
                            className="inline-flex items-center gap-3 cursor-pointer group"
                            onClick={() => setValue("smartMatch", !smartMatch)}
                        >
                            <div
                                className={`relative w-11 h-6 rounded-full shadow-inner transition-colors ${smartMatch ? "bg-blue-600" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition transform shadow-sm ${smartMatch ? "translate-x-5" : "translate-x-0"}`}
                                />
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
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                    >
                        {isSubmitting ? "Creating account..." : "Complete Registration →"}
                    </button>
                </div>
                {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
            </form>

            <p className="text-xs text-center text-gray-400 font-medium mt-6">
                <Lock className="w-3 h-3 inline pb-[2px] mr-1" aria-hidden="true" /> Your
                preferences are kept private and only shared with verified employers you apply to.
            </p>
        </div>
    );
}
