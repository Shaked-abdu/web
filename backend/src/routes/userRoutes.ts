import { Router } from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../common/authMiddleware";

const userRouter = Router();
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *        description: User not found
 *       401:
 *        description: Unauthorized
 *       500:
 *        description: Server error
 */
userRouter.get(
  "/:id",
  authMiddleware,
    UserController.getById.bind(UserController)
);


export = userRouter;
