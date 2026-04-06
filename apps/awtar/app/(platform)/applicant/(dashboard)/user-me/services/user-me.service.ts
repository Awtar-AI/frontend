import { useAuthStore } from "@/lib/store/auth";
import { usersApi } from "../api/users.api";
import { appUserFromMeResponse, parseUserMeResponse } from "../schemas/user-me.schema";

export async function fetchAndStoreCurrentUser(userId: string) {
    const raw = await usersApi.getSingle(userId);
    const parsed = parseUserMeResponse(raw);
    const user = appUserFromMeResponse(parsed);
    useAuthStore.getState().setUser(user);
    return user;
}
