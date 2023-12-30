import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *     - email
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      description: Email of the user
 *     password:
 *      type: string
 *      description: Password of the user
 *    example:
 *     email: 'test@test'
 *     password: '1234567890'
 */

export interface IUser {
  email: string;
  password: string;
  _id?: string; 
  tokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 500,
  },
  tokens: {
    type: [String]
  },
});

export default mongoose.model<IUser>("Users", userSchema);
