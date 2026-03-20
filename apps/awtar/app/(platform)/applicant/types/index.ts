export interface User {
    id: string;
    name: string;
    email: string;
    role: "applicant" | "recruiter";
    avatarUrl?: string;
    location?: string;
    title?: string;
    trustScore?: number;
    profileCompletion?: number;
}

export interface JobPost {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: "Full-time" | "Part-time" | "Contract" | "Remote" | "Freelance" | "Hybrid";
    level: "Entry" | "Junior" | "Intermediate" | "Senior" | "Lead" | "Expert";
    matchScore: number;
    tags: string[];
    datePosted: string;
    description?: string;
    responsibilities?: string[];
    requirements?: string[];
    matchPercentage?: number;
}

export type ApplicationStatus =
    | "Under Review"
    | "Interview Scheduled"
    | "Pending"
    | "Accepted"
    | "Rejected";

export interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    company: string;
    dateApplied: string;
    status: ApplicationStatus;
    statusColor?: string;
}

export interface Resume {
    id: string;
    candidateId: string;
    parsedData?: {
        contactInfo: Record<string, unknown>;
        summary: string;
        workExperience: Record<string, unknown>[];
        skills: string[];
        education: Record<string, unknown>[];
    };
}
