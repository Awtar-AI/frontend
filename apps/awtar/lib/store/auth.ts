import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getOrganizationIdFromToken, isAccessTokenExpired } from "../auth/jwt";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    role: "candidate" | "hr" | "admin" | null;
    organizationId: string | null;
    knownOrganizations: Array<{
        id: string;
        organization_name: string;
        status?: string;
        industry?: string;
        website_url?: string;
        linkedin_url?: string;
    }>;

    setSession: (data: {
        accessToken: string;
        refreshToken: string;
        userId: string;
        role: AuthState["role"];
        organizationId?: string | null;
    }) => void;
    addKnownOrganization: (organization: AuthState["knownOrganizations"][number]) => void;
    clearAuth: () => void;
}

const EMPTY: Pick<
    AuthState,
    "accessToken" | "refreshToken" | "userId" | "role" | "organizationId" | "knownOrganizations"
> = {
    accessToken: null,
    refreshToken: null,
    userId: null,
    role: null,
    organizationId: null,
    knownOrganizations: [],
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...EMPTY,
            setSession: ({ accessToken, refreshToken, userId, role, organizationId = null }) => {
                const claimOrganizationId = getOrganizationIdFromToken(accessToken);
                set({
                    accessToken,
                    refreshToken,
                    userId,
                    role,
                    // Backend authorizes tenant routes with JWT `organization_id`; prefer that.
                    organizationId: claimOrganizationId ?? organizationId,
                });
            },
            addKnownOrganization: (organization) =>
                set((state) => ({
                    knownOrganizations: [
                        organization,
                        ...state.knownOrganizations.filter((item) => item.id !== organization.id),
                    ],
                })),
            clearAuth: () => set(EMPTY),
        }),
        {
            name: "awtar-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: ({
                accessToken,
                refreshToken,
                userId,
                role,
                organizationId,
                knownOrganizations,
            }) => ({
                accessToken,
                refreshToken,
                userId,
                role,
                organizationId,
                knownOrganizations,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                if (!state.accessToken) {
                    return;
                }
                if (isAccessTokenExpired(state.accessToken)) {
                    if (state.refreshToken) {
                        state.accessToken = null;
                        return;
                    }
                    state.clearAuth();
                    return;
                }
                if (!state.organizationId) {
                    state.organizationId = getOrganizationIdFromToken(state.accessToken);
                }
            },
        },
    ),
);
