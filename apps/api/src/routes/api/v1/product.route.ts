import { Hono } from "hono";
import {
    createProduct,
    getAllProducts,
    deleteProdutById,
    getProductById,
    updateProductById,
} from "~/controllers/product.contorller";
import { productSchema } from "#";
import { zValidator } from "@hono/zod-validator";
import { withAuth, withRole } from "~/middlewares/auth";
import { ProductInput } from "~/types";
import { upload } from "~/middlewares/upload";

const router = new Hono();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
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
router.patch(
    "/:id",
    withAuth,
    zValidator("form", productSchema),
    withRole("ADMIN"),
    upload("images/product", "images"),
    async (c) => {
        const body = c.req.valid("form");
        return await updateProductById(c, body);
    },
);
router.delete("/:id", withAuth, withRole("ADMIN"), deleteProdutById);

export default router;
