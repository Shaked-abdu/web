import { Schema, model, Document, Types } from "mongoose";

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  reports: [
    {
      report_number: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
});

export interface reports {
  report_number: number;
  title: string;
  content: string;
}

export interface UserDocument extends Document {
  name: string;
  reports: Array<reports>;
}

export const User = model<UserDocument>("User", userSchema);
