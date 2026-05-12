"use client";

import { useEffect, useRef } from "react";

/**
 * Calls onViolation when document stays hidden (another tab or window took focus).
 * Uses a grace period to ignore brief blur/focus flickers.
 */
export function useTabFocusGuard(enabled: boolean, onViolation: () => void, graceMs = 1500): void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled) return undefined;

        const flush = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
        };

        const schedule = () => {
            flush();
            timerRef.current = setTimeout(() => {
                timerRef.current = null;
                if (document.visibilityState === "hidden") {
                    onViolation();
                }
            }, graceMs);
        };

        const onVis = () => {
            if (document.visibilityState === "hidden") {
                schedule();
            } else {
                flush();
            }
        };

        document.addEventListener("visibilitychange", onVis);
        return () => {
            flush();
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [enabled, onViolation, graceMs]);
}
