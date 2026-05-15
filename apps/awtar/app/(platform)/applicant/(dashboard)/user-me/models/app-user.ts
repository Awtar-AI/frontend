export type ResumeSkill = {
    name: string;
    source: string;
    category: string;
    confidence: number;
};

export type ResumeExperience = {
    raw: string;
    title?: string | null;
    company?: string | null;
    start_date?: string | null;
    end_date?: string | null;
};

export type ResumeEducation = {
    raw: string;
    degree?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    institution?: string | null;
};

export type ResumeProject = {
    raw: string;
    name?: string | null;
    description?: string | null;
};

export type ResumeCandidateData = {
    skills?: ResumeSkill[] | null;
    projects?: ResumeProject[] | null;
    education?: ResumeEducation[] | null;
    experience?: ResumeExperience[] | null;
    raw_text?: string | null;
};

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
    extracted_skills?: string[];
    resume_last_parsed_at?: string;
    resume_candidate_data?: ResumeCandidateData | null;
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
