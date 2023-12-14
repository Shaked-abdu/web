import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();
userRouter.get("/", userController.getAll.bind(userController));
userRouter.post("/", userController.create.bind(userController));

export = userRouter;
