import { Hono } from "hono";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import { withAuth } from "~/middlewares/auth";

const router = new Hono();

router.use("/user", withAuth);
router.route("/auth", authRoutes);
router.route("/user", userRoutes);

export default router;
