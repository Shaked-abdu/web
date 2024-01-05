import { Router } from "express";
import postController from "../controllers/postsController";
import authMiddleware from "../common/authMiddleware";

const postRouter = Router();
/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Server error
 */
postRouter.get("/", authMiddleware, postController.getAll.bind(postController));
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *        description: Post not found
 *       401:
 *        description: Unauthorized
 *       500:
 *        description: Server error
 */
postRouter.get(
  "/:id",
  authMiddleware,
  postController.getById.bind(postController)
);
/**
 * @swagger
 * /comments/user/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get posts for
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server error
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
postRouter.get(
  "/user/:id",
  authMiddleware,
  postController.getByUserId.bind(postController)
);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Server error
 *       401:
 *        description: Unauthorized
 */
postRouter.post("/", authMiddleware, postController.post.bind(postController));
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
postRouter.delete(
  "/:id",
  authMiddleware,
  postController.deleteById.bind(postController)
);

postRouter.put("/:id", authMiddleware, postController.updateById.bind(postController));

export = postRouter;
