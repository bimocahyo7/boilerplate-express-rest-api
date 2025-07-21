import { Router } from "express";
import registerUser from "../../handlers/auth/register-user";
import loginUser from "../../handlers/auth/login-user";

const router = Router();

router.post("/v1/auth/register", registerUser);
router.post("/v1/auth/login", loginUser)

export default router;
