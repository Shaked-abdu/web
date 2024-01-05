import { Router } from "express";
import commentController from "../controllers/commentController";
import authMiddleware from "../common/authMiddleware";

const commentRouter = Router();

/**
 * @swagger
 * /comments/post/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments by post ID
 *     security:
 *      - bearerAuth: []
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
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
commentRouter.get(
  "/post/:id",
  authMiddleware,
  commentController.getByPostId.bind(commentController)
);
/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Post a new comment
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
commentRouter.post(
  "/",
  authMiddleware,
  commentController.post.bind(commentController)
);
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment by ID
 *     security:
 *      - bearerAuth: []
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
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *        description: Server error
 */
commentRouter.delete(
  "/:id",
  authMiddleware,
  commentController.deleteById.bind(commentController)
);

export = commentRouter;
