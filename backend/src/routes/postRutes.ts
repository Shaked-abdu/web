import { Router } from "express";
import postController from "../controllers/postsController";
import authMiddleware from "../common/authMiddleware";

const postRouter = Router();
postRouter.get("/", postController.getAll.bind(postController));
postRouter.get("/:id", postController.getById.bind(postController));
// postRouter.get("/:id/comments", postController.getComments.bind(postController));
postRouter.post("/", authMiddleware, postController.post.bind(postController));
// postRouter.put("/:id", authMiddleware, postController.updateById.bind(postController));
// postRouter.delete("/:id", authMiddleware, postController.deleteById.bind(postController));

export = postRouter;
