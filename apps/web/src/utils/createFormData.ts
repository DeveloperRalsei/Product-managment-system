export function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            for (const item of value) {
                formData.append(key, item);
            }
        } else {
            formData.append(key, value);
        }
    }

    return formData;
}
