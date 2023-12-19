import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
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
});

export default mongoose.model<IUser>("Users", userSchema);
