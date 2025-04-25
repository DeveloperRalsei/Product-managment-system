import { Hono } from "hono";
import {
    authUser,
    loginUser,
    logoutUser,
    sendEmailVerification,
    verifyUser,
} from "~/controllers";

const router = new Hono();

router.get("/", authUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify", verifyUser);
router.post("/send-code", sendEmailVerification);

export default router;
