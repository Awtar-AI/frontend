import { MapPin } from "lucide-react";
import { mockJobs } from "../../../lib/mockData";

export function JobRecommendations() {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                    AI-Powered Job Recommendations
                </h3>
                <button
                    type="button"
                    className="px-4 py-1.5 border-2 border-gray-200 text-gray-700 text-[10px] uppercase tracking-wider font-black rounded-lg hover:border-gray-900 transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="space-y-5">
                {mockJobs.slice(0, 3).map((job) => (
                    <button
                        key={job.id}
                        type="button"
                        onClick={() => {}}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                // Handle interaction
                            }
                        }}
                        className="w-full text-left p-6 border border-gray-200 rounded-3xl hover:border-blue-400 transition-colors group cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="mb-4 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                            10 min ago
                        </div>

                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                    {job.title}
                                </h4>
                                <div
                                    className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${job.matchPercentage && job.matchPercentage > 80 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                                >
                                    {job.matchPercentage}% match
                                </div>
                            </div>
                            <span className="px-6 py-2 bg-gray-900 group-hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-md inline-block">
                                Apply
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500 mb-5">
                            <span>Hourly • $50/hr</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>3 months</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>Hybrid</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>Intermediate</span>
                        </div>

                        <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-1">
                            Looking for a creative UI/UX Designer to enhance user experience for{" "}
                            {job.company} utilizing cutting edge tools...
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {job.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
