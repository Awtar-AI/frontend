import { getPublicJobExperienceLevel, type PublicJob } from "../schemas/public-jobs.schema";

export function formatPublicJobSalary(job: PublicJob): string {
    if (job.salary_type === "undisclosed") return "Undisclosed";
    const c = job.currency?.trim() || "";
    if (job.salary_type === "fixed" && job.min_salary != null) {
        return c ? `${c} ${job.min_salary.toLocaleString()}` : String(job.min_salary);
    }
    if (job.salary_type === "range" && job.min_salary != null && job.max_salary != null) {
        return c
            ? `${c} ${job.min_salary.toLocaleString()} – ${job.max_salary.toLocaleString()}`
            : `${job.min_salary} – ${job.max_salary}`;
    }
    return "—";
}

export function formatPublicJobLocation(job: PublicJob): string {
    if (job.is_remote) return "Remote";
    return job.location?.trim() || "—";
}

export function formatEmploymentTypeLabel(raw: string): string {
    const map: Record<string, string> = {
        full_time: "Full-time",
        part_time: "Part-time",
        contract: "Contract",
        internship: "Internship",
        temporary: "Temporary",
    };
    return map[raw] ?? raw.replace(/_/g, " ");
}

export function formatExperienceLevelLabel(job: PublicJob): string {
    const v = getPublicJobExperienceLevel(job);
    const map: Record<string, string> = {
        entry: "Entry",
        mid: "Mid",
        senior: "Senior",
        lead: "Lead",
    };
    return map[v] ?? v;
}
