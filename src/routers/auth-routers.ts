import { Router } from "express";
import {
	login,
	requestPasswordChange,
	signUp,
	updatePassword,
	validateUserEmail,
} from "../controllers/auth-controllers";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.post("/newpasswordrequest", requestPasswordChange);
authRouter.put("/updatepassword", updatePassword);
authRouter.put("/usermail", validateUserEmail);

export { authRouter };
