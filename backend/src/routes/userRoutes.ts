import { Router } from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../common/authMiddleware";

const userRouter = Router();

userRouter.get(
  "/:id",
  authMiddleware,
    UserController.getById.bind(UserController)
);


export = userRouter;
