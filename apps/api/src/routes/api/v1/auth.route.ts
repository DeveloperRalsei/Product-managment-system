import { Hono } from "hono";
import { authUser, loginUser, logoutUser } from "~/controllers";

const router = new Hono();

router.get("/", authUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
