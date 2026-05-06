import http from "@/lib/http";
import {
    parseRecruiterCandidateProfile,
    type RecruiterCandidateProfile,
} from "../schemas/recruiter-candidate-profile.schema";

export const recruiterCandidateApi = {
    async getById(userId: string): Promise<RecruiterCandidateProfile> {
        const { data } = await http.get(`/api/v1/users/${userId}/single`);
        return parseRecruiterCandidateProfile(data);
    },
};
