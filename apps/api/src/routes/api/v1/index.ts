import { Hono } from "hono";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import fileRoutes from "./file.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/user", userRoutes);
router.route("/product", productRoutes);
router.route("/upload", fileRoutes);
router.route("/category", categoryRoutes);

export default router;
