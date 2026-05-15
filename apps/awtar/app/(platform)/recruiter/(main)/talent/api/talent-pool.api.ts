import http from "@/lib/http";
import {
    parseTalentPoolResponse,
    type TalentPoolResponse,
} from "../schemas/talent-pool.schema";

export const talentPoolApi = {
    async listCandidates(): Promise<TalentPoolResponse> {
        const { data } = await http.get("/api/v1/users", {
            params: {
                role: "candidate",
                page: 1,
                page_size: 200,
            },
        });
        return parseTalentPoolResponse(data);
    },
};
