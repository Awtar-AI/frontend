import { appToast } from "../store/toast";

export const toastService = {
    success(message: string) {
        appToast.success(message);
    },
    error(message: string) {
        appToast.error(message);
    },
    info(message: string) {
        appToast.info(message);
    },
};
