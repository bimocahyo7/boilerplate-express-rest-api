import { Router } from "express";
import getAllUsers from "../../handlers/user/get";
import getUserById from "../../handlers/user/getById";
import createNewUser from "../../handlers/user/post";

const router = Router();

router.get("/v1/user", getAllUsers);
router.get("/v1/user/:id", getUserById);
router.post("/v1/user", createNewUser)

export default router;
