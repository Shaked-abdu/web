import mongoose from "mongoose";


/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *    type: object
 *    required:
 *     - postId
 *     - content
 *    properties:
 *     postId:
 *      type: string
 *      description: Post id of the comment
 *     content:
 *      type: string
 *      description: Comment content
 *    example:
 *     postId: '245t34985u0293u40y05235'
 *     content: 'comment 1'
 */
export interface IComment {
  content: string;
  postId: string;
  owner?: string;
  _id?: string;
}

const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  postId: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  }
});

export default mongoose.model<IComment>("Comments", commentSchema);
