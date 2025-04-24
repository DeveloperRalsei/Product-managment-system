import { Hono } from "hono";
import { createUser, getAllUsers } from "~/controllers/user.controller";
import { withAuth } from "~/middlewares/auth";

const router = new Hono();

router.get("/", getAllUsers);
router.post("/new", withAuth, createUser);

export default router;
