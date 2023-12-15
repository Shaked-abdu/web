import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  doctorId: string;
  _id: string;
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
    doctorId: {
        type: String,
        required: true,
    },
    _id: {
        type: String,
        required: true,
    },
    });

export default mongoose.model<IPost>("Posts", postSchema);
