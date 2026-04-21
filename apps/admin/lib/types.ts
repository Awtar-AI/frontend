export type Role = "CANDIDATE" | "HR" | "ADMIN";

export type OrgStatus = "pending" | "active" | "suspended" | "rejected";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    organizationId?: string | null;
}

export interface OrganizationSummary {
    id: string;
    organizationName: string;
    industry?: string;
    organizationSize: number;
    websiteUrl: string;
    status: OrgStatus;
    createdAt: string;
}

export interface OrganizationDetail extends OrganizationSummary {
    linkedInUrl?: string;
    creator: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    businessDocuments: {
        documentUrl: string;
        originalName: string;
    }[];
}

export interface PaginatedOrganizations {
    organizations: OrganizationSummary[];
    total: number;
    page: number;
    pageSize: number;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface DashboardStats {
    totalOrgs: number;
    pendingOrgs: number;
    activeOrgs: number;
    suspendedOrgs: number;
}
