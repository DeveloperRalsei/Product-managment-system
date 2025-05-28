import { categorySchema } from "#";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
    getAllCategories,
    createNewCategory,
} from "~/controllers/category.controller";
import { withAuth, withRole } from "~/middlewares/auth";

const router = new Hono();

router.get("/", getAllCategories);
router.post(
    "/new",
    withAuth,
    withRole("ADMIN"),
    zValidator("form", categorySchema),
    async (c) => {
        const body = c.req.valid("form");
        return await createNewCategory(c, body);
    },
);

export default router;
