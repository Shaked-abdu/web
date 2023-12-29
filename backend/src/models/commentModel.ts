import mongoose from "mongoose";

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
