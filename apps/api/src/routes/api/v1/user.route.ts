import { Hono } from "hono";
import {
    createUser,
    deleteUser,
    editUser,
    getAllUsers,
    getUser,
} from "~/controllers/user.controller";
import { withAuth, withRole } from "~/middlewares/auth";

const router = new Hono();

router.get("/", getAllUsers);
router.get("/:email_or_id", getUser);
router.post("/new", withAuth, withRole("ADMIN"), createUser);
router.delete("/:email_or_id", withAuth, withRole("ADMIN"), deleteUser);
router.patch("/:email_or_id", withAuth, withRole("ADMIN"), editUser);

export default router;
