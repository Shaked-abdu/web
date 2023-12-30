import { Router } from "express";
import commentController from "../controllers/commentController";
import authMiddleware from "../common/authMiddleware";

const commentRouter = Router();

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments by post ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get comments for
 *     responses:
 *       200:
 *         description: Successful operation
 */
commentRouter.get(
  "/post/:id",
  authMiddleware,
  commentController.getByPostId.bind(commentController)
);
/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Post a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Created
 */
commentRouter.post(
  "/",
  authMiddleware,
  commentController.post.bind(commentController)
);
/**
 * @swagger
 * /{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Deleted
 */
commentRouter.delete(
  "/:id",
  authMiddleware,
  commentController.deleteById.bind(commentController)
);

export = commentRouter;
