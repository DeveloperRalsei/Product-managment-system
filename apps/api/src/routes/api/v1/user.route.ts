import { Hono } from "hono";
import { createUser, getAllUsers } from "~/controllers/user.controller";

const router = new Hono();

router.get("/", getAllUsers);
router.post("/new", createUser);

export default router;
