import { Hono } from "hono";
import { upload } from "~/middlewares/upload";

const router = new Hono();

router.post("/", upload("images", "images"), async (c) => {
    // @ts-ignore i dunno why ts got mad at me here :/
    const files = c.get("uploadedFiles");
    return c.json({
        message: "Files upladed",
        files,
    });
});

export default router;
