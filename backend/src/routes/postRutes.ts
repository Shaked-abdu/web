import { Router } from "express";
import postController from "../controllers/postsController";

const postRouter = Router();
postRouter.get("/", postController.getAll.bind(postController));
postRouter.get("/:id", postController.getById.bind(postController));
postRouter.get("/:id/comments", postController.getComments.bind(postController));
postRouter.post("/", postController.create.bind(postController));
postRouter.put("/:id", postController.updateById.bind(postController));
postRouter.delete("/:id", postController.deleteById.bind(postController));

export = postRouter;
