import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *  schemas:
 *   Post:
 *    type: object
 *    required:
 *     - title
 *     - content
 *    properties:
 *     title:
 *      type: string
 *      description: Post title
 *     content:
 *      type: string
 *      description: Post content
 *    example:
 *     title: 'title1'
 *     content: 'message1'
 */
export interface IPost {
  title: string;
  content: string;
  owner?: string;
  _id?: string;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  owner: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPost>("Posts", postSchema);
