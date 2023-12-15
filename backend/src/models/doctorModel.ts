import mongoose from "mongoose";

export interface IDoctor {
  name: string;
  _id: string;
}

const doctorSchema = new mongoose.Schema<IDoctor>({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IDoctor>("Doctors", doctorSchema);
