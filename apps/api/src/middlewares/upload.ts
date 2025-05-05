import { MiddlewareHandler } from "hono";
import { mkdir, writeFile } from "fs/promises";
import { ACCEPTED_FILE_TYPES } from "#";
import path from "path";

export const upload =
    (storePath: string, formDataName: string): MiddlewareHandler =>
    async (c, next) => {
        const body = await c.req.parseBody({ all: true });
        const files = Array.isArray(body[formDataName])
            ? body[formDataName]
            : [body[formDataName]];

        const savedFiles: string[] = [];

        await mkdir(path.join("static", storePath), { recursive: true });

        for (const file of files) {
            if (!(file instanceof File)) continue;
            if (!ACCEPTED_FILE_TYPES.includes(file.type)) continue;

            const fileName = `${Date.now()}-${file.name}`;

            const fileSavePath = path.join("static", storePath, fileName);
            const buffer = Buffer.from(await file.arrayBuffer());

            await writeFile(fileSavePath, buffer).catch(console.error);

            const publicUrl = `/static/${storePath}/${fileName}`;
            savedFiles.push(publicUrl);
        }

        c.set("uploadedFiles", savedFiles);
        await next();
    };
