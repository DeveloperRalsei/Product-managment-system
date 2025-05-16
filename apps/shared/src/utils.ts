export const wait = (milliseconds: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export const tryCatch = async <T extends any, E extends Error = Error>(
    cb: () => Promise<T>,
    logError = true,
    onFinal?: () => void,
): Promise<[Awaited<ReturnType<typeof cb>>, null] | [null, E]> => {
    try {
        const result = await cb();
        return [result, null];
    } catch (error) {
        if (logError) console.error(error);
        const err = error instanceof Error ? error : new Error(String(error));
        return [null, err as E];
    } finally {
        onFinal?.();
    }
};
