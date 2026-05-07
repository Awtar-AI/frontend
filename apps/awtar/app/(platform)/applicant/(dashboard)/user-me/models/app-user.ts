/** Candidate slice from `GET /users/:id/single` (see APPLICANT-FRONTEND-API.md). */
export type CandidateProfile = {
    current_job_title?: string;
    desired_annual_salary_max?: number;
    desired_annual_salary_min?: number;
    education_level?: string;
    industry_interest?: string;
    match_smart_notification?: boolean;
    preferred_job_types?: string[];
    primary_skills?: string[];
    resume_url?: string;
    years_of_experience?: number;
};

export type AppUser = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "candidate" | "hr" | "admin";
    is_active?: boolean;
    profile_pic_url?: string | null;
    candidate_profile?: CandidateProfile | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    deleted_by?: string | null;
    last_logged_in_at?: string | null;
};
