import { Hono } from "hono";
import { authUser } from "~/controllers";

const router = new Hono();

router.get("/", authUser);

export default router;
