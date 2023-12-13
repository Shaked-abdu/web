import { Router } from "express";
import {
  getUsers,
  getUsersReports,
  postUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/reports", getUsersReports);

userRouter.post("/", postUser);

export default userRouter;
