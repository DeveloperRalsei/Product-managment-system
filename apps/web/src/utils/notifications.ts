import { showNotification } from "@mantine/notifications";

export const notifyWithResponse = (res: Response) => {
    switch (res.status) {
        case 201:
            return showNotification({
                color: "green",
                message: "İşlem başarılı",
            });
        case 202:
            return showNotification({
                color: "green",
                message: "İşlem başarılı",
            });
        case 401:
            return showNotification({
                color: "red",
                message: "Buna izniniz yok",
            });
        case 403:
            return showNotification({
                message: "Tekrar deneyin",
                color: "red",
            });
        case 404:
            return showNotification({ color: "red", message: "Bulunamadı" });
        case 409:
            return showNotification({
                color: "red",
                message: "Zaten kullanımda",
            });
        default:
            return showNotification({
                color: "red",
                message: "Birşey ters gitti",
            });
    }
};
