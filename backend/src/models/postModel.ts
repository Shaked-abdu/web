import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner?: string;
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
