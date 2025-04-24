import { Hono } from "hono";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/user", userRoutes);

export default router;
