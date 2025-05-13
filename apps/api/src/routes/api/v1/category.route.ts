import { Hono } from "hono";
import { getAllCategories } from "~/controllers/category.controller";

const router = new Hono();

router.get("/", getAllCategories);

export default router;
