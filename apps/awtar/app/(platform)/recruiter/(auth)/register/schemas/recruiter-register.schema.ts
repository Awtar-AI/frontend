import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Enums (must match backend RegisterOrganizationDto validators)     */
/* ------------------------------------------------------------------ */

export const recruiterIndustryOptions = [
    { value: "Tech", label: "Technology" },
    { value: "Finance", label: "Finance & Banking" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" },
] as const;

export type RecruiterIndustry = (typeof recruiterIndustryOptions)[number]["value"];

/* ------------------------------------------------------------------ */
/*  UI wizard form schema (react-hook-form + zodResolver)             */
/* ------------------------------------------------------------------ */

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

export const recruiterRegisterFormSchema = z
    .object({
        fullName: z.string().trim().min(2, "Full name is required"),
        email: z.string().email("Enter a valid email"),
        phone: z.string().trim().min(1, "Phone number is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(72, "Password must be at most 72 characters")
            .regex(strongPassword, "Must include uppercase, lowercase, number, and symbol"),
        organizationName: z
            .string()
            .trim()
            .min(2, "Min 2 characters")
            .max(150, "Max 150 characters"),
        websiteUrl: z.string().url("Enter a valid URL"),
        industry: z.string().min(1, "Select an industry"),
        organizationSize: z.number().int().min(1, "Must be at least 1"),
        linkedinUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
        businessDocuments: z
            .array(z.instanceof(File))
            .min(1, "Upload at least one document")
            .max(3, "Maximum 3 documents"),
    })
    .superRefine((data, ctx) => {
        if (data.fullName.trim().split(/\s+/).length < 2) {
            ctx.addIssue({
                code: "custom",
                path: ["fullName"],
                message: "Enter first and last name",
            });
        }
        for (let i = 0; i < data.businessDocuments.length; i++) {
            const file = data.businessDocuments[i];
            if (!file) continue;
            if (file.size > 5 * 1024 * 1024) {
                ctx.addIssue({
                    code: "custom",
                    path: ["businessDocuments"],
                    message: `${file.name} exceeds 5 MB limit`,
                });
            }
        }
    });

export type RecruiterRegisterFormData = z.infer<typeof recruiterRegisterFormSchema>;

/* ------------------------------------------------------------------ */
/*  Per-step field groups (for form.trigger validation)               */
/* ------------------------------------------------------------------ */

export const RECRUITER_STEP_FIELDS: Record<
    1 | 2 | 3,
    readonly (keyof RecruiterRegisterFormData)[]
> = {
    1: ["fullName", "email", "phone", "password"],
    2: ["organizationName", "websiteUrl", "industry", "organizationSize"],
    3: ["businessDocuments"],
};

/* ------------------------------------------------------------------ */
/*  API payload (multipart/form-data for POST /organizations/register)*/
/* ------------------------------------------------------------------ */

export interface RecruiterRegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    organization_name: string;
    website_url: string;
    industry: string;
    organization_size: number;
    linkedin_url?: string;
    business_documents: File[];
}

export interface RecruiterRegisterResponse {
    id: string;
    message: string;
}

export function toRecruiterPayload(data: RecruiterRegisterFormData): RecruiterRegisterPayload {
    const parts = data.fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || "";

    return {
        first_name: firstName,
        last_name: lastName,
        email: data.email.trim(),
        phone: data.phone.trim(),
        password: data.password,
        organization_name: data.organizationName.trim(),
        website_url: data.websiteUrl.trim(),
        industry: data.industry,
        organization_size: data.organizationSize,
        linkedin_url: data.linkedinUrl?.trim() || undefined,
        business_documents: data.businessDocuments,
    };
}
