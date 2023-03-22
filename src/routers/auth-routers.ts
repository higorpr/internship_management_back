import { Router } from "express";
import { signUp } from "../controllers/auth-controllers";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
// authRouter.post("/login");

export { authRouter };
