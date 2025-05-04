import { MiddlewareHandler } from "hono";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { ACCEPTED_FILE_TYPES } from "#";

export const upload =
    (storePath: string, formDataName: string): MiddlewareHandler =>
    async (c, next) => {
        const body = await c.req.parseBody({ all: true });
        const files = Array.isArray(body[formDataName])
            ? body[formDataName]
            : [body[formDataName]];

        const savedFiles: string[] = [];
        if (!storePath.startsWith(process.cwd()))
            storePath = join(process.cwd(), "static", storePath);

        await mkdir(storePath, { recursive: true }).catch(console.log);

        for (let f of files) {
            if (!(f instanceof File)) continue;

            if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
                console.log("Unallowed file type: ", f.type);
            }

            const fileName = `${Date.now()}-${f.name}`;

            const filePath = join(storePath, fileName);

            const buffer = Buffer.from(await f.arrayBuffer());

            await writeFile(filePath, buffer).catch(console.log);

            const fileUrl = filePath;
            savedFiles.push(fileUrl);
        }

        c.set("uploadedFiles", savedFiles);

        await next();
    };
