import {
    LoginResponse,
    OrganizationDetail,
    OrganizationSummary,
    PaginatedOrganizations,
    User,
    OrgStatus,
} from "./types";

// Static mock database for organizations so pagination and filters work!
const MOCK_ORGSDB: OrganizationSummary[] = Array.from({ length: 65 }).map((_, i) => {
    let status: OrgStatus = "active";
    if (i % 7 === 0) status = "pending";
    else if (i % 12 === 0) status = "suspended";
    return {
        id: `org-${i}`,
        organizationName: i % 2 === 0 ? `TechCorp Innovators ${i}` : `Health Plus Clinics ${i}`,
        industry: i % 2 === 0 ? "Tech" : "Healthcare",
        organizationSize: (i + 1) * 15,
        websiteUrl: `https://example${i}.com`,
        status: status,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(), // i days ago
    };
});

export async function login(email: string, password: string): Promise<LoginResponse> {
    if (email && password) {
        return {
            accessToken: "mock.access.token",
            refreshToken: "mock.refresh.token",
            user: {
                id: "admin-123",
                email: email,
                firstName: "Super",
                lastName: "Admin",
                role: "ADMIN",
                isActive: true,
                createdAt: new Date().toISOString(),
            },
        };
    }
    throw new Error("Please enter an email and password");
}

export async function getDashboardStats() {
    return {
        totalOrgs: MOCK_ORGSDB.length,
        pendingOrgs: MOCK_ORGSDB.filter(o => o.status === "pending").length,
        activeOrgs: MOCK_ORGSDB.filter(o => o.status === "active").length,
        suspendedOrgs: MOCK_ORGSDB.filter(o => o.status === "suspended").length,
    };
}

export async function getOrganizations(page = 1, pageSize = 20, status?: string, q?: string): Promise<PaginatedOrganizations> {
    let results = [...MOCK_ORGSDB];

    // Apply Filter
    if (status && status !== "all") {
        results = results.filter(org => org.status === status);
    }

    // Apply Search
    if (q) {
        const query = q.toLowerCase();
        results = results.filter(org => 
            org.organizationName.toLowerCase().includes(query) ||
            (org.industry || "").toLowerCase().includes(query)
        );
    }

    const total = results.length;
    
    // Apply Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    results = results.slice(startIndex, endIndex);

    return {
        organizations: results,
        total,
        page,
        pageSize,
    };
}

export async function getOrganizationById(id: string): Promise<OrganizationDetail> {
    const org = MOCK_ORGSDB.find(o => o.id === id) || MOCK_ORGSDB[0];
    
    return {
        ...org,
        linkedInUrl: `https://linkedin.com/company/${org.organizationName.replace(/\s+/g, '').toLowerCase()}`,
        creator: {
            firstName: "Admin",
            lastName: "User",
            email: "founder@example.com",
            phone: "+251911234567"
        },
        businessDocuments: [
            {
                originalName: "business_registration.pdf",
                documentUrl: "#mock-url-1"
            },
            {
                originalName: "tax_certificate.png",
                documentUrl: "#mock-url-2"
            }
        ]
    };
}

export async function updateOrganizationStatus(id: string, status: OrgStatus): Promise<void> {
    console.log(`Updated org ${id} to status: ${status}`);
    // Update local memory DB so ui changes instantly inside details view!
    const org = MOCK_ORGSDB.find(o => o.id === id);
    if(org) org.status = status;
    return Promise.resolve();
}

export async function getUsers(): Promise<User[]> {
    return Array.from({ length: 5 }).map((_, i) => ({
        id: `user-${i}`,
        email: `user${i}@example.com`,
        firstName: `User`,
        lastName: `${i}`,
        role: "CANDIDATE",
        isActive: i !== 2, // user 2 is inactive
        createdAt: new Date(Date.now() - i * 100000000).toISOString(),
    }));
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    console.log(`Updated user ${userId} active state to ${isActive}`);
    return Promise.resolve();
}
