import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/logout", authController.logout);
authRouter.get("/refresh", authController.refresh);

export = authRouter;
