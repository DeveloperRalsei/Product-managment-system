import { Hono } from "hono";
import {
    createUser,
    deleteUser,
    editUser,
    getAllUsers,
} from "~/controllers/user.controller";
import { withAuth } from "~/middlewares/auth";

const router = new Hono();

router.get("/", getAllUsers);
router.post("/new", withAuth, createUser);
router.delete("/:email_or_id", withAuth, deleteUser);
router.patch("/:email_or_id", withAuth, editUser);

export default router;
