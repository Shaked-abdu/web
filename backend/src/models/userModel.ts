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
 *     - firstName
 *     - lastName
 *     - age
 *     - profession
 *     - phoneNumber
 *     - id
 *    properties:
 *     email:
 *      type: string
 *      description: Email of the user
 *     password:
 *      type: string
 *      description: Password of the user
 *     firstName:
 *      type: string
 *      description: First name of the user
 *     lastName:
 *      type: string
 *      description: Last name of the user
 *     age:
 *      type: number
 *      description: Age of the user
 *     profession:
 *      type: string
 *      description: Profession of the user
 *     phoneNumber:
 *      type: string
 *      description: Phone number of the user
 *     id:
 *      type: string
 *      description: ID of the user
 *    example:
 *     email: 'test@test'
 *     password: '1234567890'
 *     firstName: 'firstName'
 *     lastName: 'lastName'
 *     age: 20
 *     profession: 'profession'
 *     phoneNumber: 'phoneNumber'
 *     id: '3164451351'
 */

export interface IUser {
  email: string;
  password?: string;
  _id?: string; 
  tokens?: string[];
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  phoneNumber: string;
  id: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  tokens: {
    type: [String]
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 20,
  },
  age: {
    type: Number,
    required: true,
  },
  profession: {
    type: String,
    required: true,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    maxlength: 20,
  },
  id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("Users", userSchema);
