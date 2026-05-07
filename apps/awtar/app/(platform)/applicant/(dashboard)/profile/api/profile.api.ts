import http from "@/lib/http";
import type { UpdateCandidateProfilePayload, UpdateUserPayload } from "../schemas/profile.schema";

export const profileApi = {
    async updateUser(userId: string, payload: UpdateUserPayload) {
        const { data } = await http.patch(`/api/v1/users/${userId}/update`, payload);
        return data;
    },

    async updateCandidateProfile(userId: string, payload: UpdateCandidateProfilePayload) {
        const { data } = await http.patch(
            `/api/v1/users/${userId}/update-candidate-profile`,
            payload,
        );
        return data;
    },

    async uploadResume(userId: string, file: File) {
        const fd = new FormData();
        fd.append("resume", file);
        const { data } = await http.patch(`/api/v1/users/${userId}/upload-resume`, fd);
        return data;
    },

    async uploadProfilePic(userId: string, file: File) {
        const fd = new FormData();
        fd.append("profile_pic", file);
        const { data } = await http.patch(`/api/v1/users/${userId}/upload-profile-pic`, fd);
        return data as { message: string };
    },
};
