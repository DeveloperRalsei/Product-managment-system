import { Hono } from "hono";
import {
    createProduct,
    getAllProducts,
} from "~/controllers/product.contorller";
import { productSchema } from "#";
import { zValidator } from "@hono/zod-validator";
import { withAuth, withRole } from "~/middlewares/auth";
import { ProductInput } from "~/types";
import { upload } from "~/middlewares/upload";

const router = new Hono();

router.get("/", getAllProducts);
router.post(
    "/new",
    withAuth,
    withRole("ADMIN"),
    zValidator("form", productSchema),
    upload("images/product", "images"),
    async (c) => {
        const body: ProductInput = c.req.valid("form");
        return await createProduct(c, body);
    },
);

export default router;
