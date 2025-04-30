import { Hono } from "hono";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import fileRoutes from "./file.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/user", userRoutes);
router.route("/upload", fileRoutes);

export default router;
