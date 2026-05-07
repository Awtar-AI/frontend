"use client";

import Image from "next/image";
import { useState } from "react";
import type { AppUser } from "../models/app-user";
import { applicantDisplayName } from "../schemas/user-me.schema";

function initialsFromUser(user: Pick<AppUser, "first_name" | "last_name" | "email">): string {
    const a = user.first_name?.trim().charAt(0) ?? "";
    const b = user.last_name?.trim().charAt(0) ?? "";
    if (a || b) return `${a}${b}`.toUpperCase();
    return user.email?.trim().charAt(0).toUpperCase() || "?";
}

export function UserAvatar({
    user,
    className = "",
    sizeClassName = "w-8 h-8 text-xs",
}: {
    user: Pick<AppUser, "first_name" | "last_name" | "email" | "profile_pic_url">;
    className?: string;
    sizeClassName?: string;
}) {
    const [imgError, setImgError] = useState(false);
    const src = user.profile_pic_url;

    if (src && !imgError) {
        return (
            <Image
                src={src}
                alt={initialsFromUser(user)}
                width={96}
                height={96}
                unoptimized
                onError={() => setImgError(true)}
                className={`rounded-full object-cover shrink-0 ${sizeClassName} ${className}`}
            />
        );
    }

    return (
        <div
            className={`rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 ${sizeClassName} ${className}`}
            aria-hidden
        >
            {initialsFromUser(user)}
        </div>
    );
}

export function userAvatarAlt(user: AppUser): string {
    return applicantDisplayName(user) || user.email;
}
