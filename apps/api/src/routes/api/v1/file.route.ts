import { Hono } from "hono";
import { upload } from "~/middlewares/upload";

const router = new Hono();

router.post("/", upload("test", "images"), async (c) => {
    // @ts-ignore i dunno why ts got mad at me here :/
    const files = c.get("uploadedFiles");
    console.log(files);
    return c.json({
        message: "Files upladed",
        files,
    });
});

export default router;
