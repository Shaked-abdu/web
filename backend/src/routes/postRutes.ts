import { Router } from "express";
import postController from "../controllers/postsController";
import authMiddleware from "../common/authMiddleware";

const postRouter = Router();
postRouter.get("/", authMiddleware, postController.getAll.bind(postController));
postRouter.get("/:id", authMiddleware, postController.getById.bind(postController));
postRouter.get("/user/:id", authMiddleware, postController.getByUserId.bind(postController));
postRouter.post("/", authMiddleware, postController.post.bind(postController));
postRouter.delete("/:id", authMiddleware, postController.deleteById.bind(postController));

export = postRouter;
