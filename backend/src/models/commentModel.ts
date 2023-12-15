import mongoose from "mongoose";

export interface IComment {
  content: string;
  postId: string;
  doctorId: string;
  _id: string;
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
  doctorId: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IComment>("Comments", commentSchema);
