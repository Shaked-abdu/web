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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            description: Email of the user
 *            example: 'test@test'
 *           firstName:
 *            type: string
 *            description: First name of the user
 *            example: 'firstName'
 *           lastName:
 *            type: string
 *            description: Last name of the user
 *            example: 'lastName'
 *           age:
 *            type: number
 *            description: Age of the user
 *            example: 20
 *           profession:
 *            type: string
 *            description: Profession of the user
 *            example: 'profession'
 *           phoneNumber:
 *            type: string
 *            description: Phone number of the user
 *            example: 'phoneNumber'
 *           id:
 *            type: string
 *            description: ID of the user
 *            example: '3164451351'
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
userRouter.put("/:id", authMiddleware, UserController.update.bind(UserController));


export = userRouter;
