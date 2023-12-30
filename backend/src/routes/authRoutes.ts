import { Router } from "express";
import authController from "../controllers/authController";

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentification API endpoints
 */
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   Token:
 *    type: object
 *    required:
 *     - accessToken
 *     - refreshToken
 *    properties:
 *     accessToken:
 *      type: string
 *      description: The JWT Access token
 *     refreshToken:
 *      type: string
 *      description: The JWT Refresh token
 *    example:
 *     accessToken: 'dsgsdgsgsdg'
 *     refreshToken: 'sdjanfklknnlnkmlds'
 */
const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *   summary: registers a new user
 *   tags: [Auth]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *   responses:
 *    201:
 *     description: The new user
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 */
authRouter.post("/register", authController.register);
/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: logs in a user
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *     description: The JWT tokens
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Token'
 */
authRouter.post("/login", authController.login);


/**
 * @swagger
 * /auth/logout:
 *  get:
 *   summary: logs out a user
 *   tags: [Auth]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: logout completed successfully
 */
authRouter.get("/logout", authController.logout);

/**
* @swagger
* /auth/refreshToken:
*  get:
*   summary: get a new access token using the refresh token
*   tags: [Auth]
*   description: need to provide the refresh token in the auth header
*   security:
*    - bearerAuth: []
*   responses:
*    200:
*     description: The acess & refresh tokens
*     content:
*      application/json:
*       schema:
*         $ref: '#/components/schemas/Token'
*/
authRouter.get("/refresh", authController.refresh);

export = authRouter;
