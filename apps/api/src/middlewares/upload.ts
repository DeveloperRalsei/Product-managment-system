import { Context, MiddlewareHandler } from "hono";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { MIMEType } from "util";

type Variables = {
    uploadedFiles: string[];
};

const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

export const upload =
    (storePath: string, formDataName: string): MiddlewareHandler =>
    async (c: Context<{ Variables: Variables }>, next) => {
        const body = await c.req.parseBody({ all: true });
        const files = Array.isArray(body[formDataName])
            ? body[formDataName]
            : [body[formDataName]];

        const savedFiles: string[] = [];
        if (!storePath.startsWith(process.cwd()))
            storePath = join(process.cwd(), "static", storePath);

        await mkdir(storePath, { recursive: true });

        for (let f of files) {
            if (!(f instanceof File)) continue;

            if (allowedTypes.includes(f.type)) continue;

            const fileName = `${Date.now()}-${f.name}`;

            const filePath = join(storePath, fileName);
            console.log(filePath);

            const buffer = Buffer.from(await f.arrayBuffer());

            await writeFile(filePath, buffer);

            const fileUrl = filePath;
            savedFiles.push(fileUrl);
        }

        c.set("uploadedFiles", savedFiles);

        await next();
    };
