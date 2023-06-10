import { Router } from "express";
import {
	login,
	signUp,
	validateUserEmail,
} from "../controllers/auth-controllers";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.put("/usermail", validateUserEmail);

export { authRouter };
