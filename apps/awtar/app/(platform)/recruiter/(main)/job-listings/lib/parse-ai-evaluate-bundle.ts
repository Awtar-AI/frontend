/** Best-effort read of EvaluateApplication-like `response_json` stored on an application row. */

export type RiskFlag = {
    type?: string;
    message?: string;
    severity?: string;
};

export type EvaluateBundleSignals = {
    verificationReason?: string;
    verificationSkills?: string[];
    trustFlags: RiskFlag[];
    matchCoverage?: string;
};

export function parseEvaluateBundle(responseJson: unknown): EvaluateBundleSignals | null {
    let rootUnknown: unknown = responseJson;
    if (typeof responseJson === "string") {
        try {
            rootUnknown = JSON.parse(responseJson) as unknown;
        } catch {
            return null;
        }
    }
    if (!rootUnknown || typeof rootUnknown !== "object") return null;
    const root = rootUnknown as Record<string, unknown>;

    const verification = root.verification as Record<string, unknown> | undefined;
    const trust = root.trust as Record<string, unknown> | undefined;
    const match = root.match as Record<string, unknown> | undefined;

    const trustFlagsRaw = trust?.risk_flags as unknown[] | undefined;
    const trustFlags: RiskFlag[] = Array.isArray(trustFlagsRaw)
        ? trustFlagsRaw.map((f) => (typeof f === "object" && f !== null ? (f as RiskFlag) : {}))
        : [];

    const skillsRaw = verification?.skills_to_verify as unknown;
    const verificationSkills = Array.isArray(skillsRaw)
        ? skillsRaw.filter((x): x is string => typeof x === "string")
        : [];

    const verificationReason =
        typeof verification?.reason === "string" ? verification.reason : undefined;

    let matchCoverage: string | undefined;
    if (match && typeof match.matched_requirements === "object") {
        try {
            matchCoverage = JSON.stringify(match.matched_requirements);
        } catch {
            matchCoverage = undefined;
        }
    }

    return {
        verificationReason,
        verificationSkills,
        trustFlags,
        matchCoverage,
    };
}
