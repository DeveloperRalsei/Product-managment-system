import { Hono } from "hono";
import { authUser, loginUser } from "~/controllers";

const router = new Hono();

router.get("/", authUser);
router.post("/login", loginUser);

export default router;
