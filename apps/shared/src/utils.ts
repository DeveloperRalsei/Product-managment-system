export const wait = (milliseconds: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;
