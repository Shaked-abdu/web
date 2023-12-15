import { StatusCodes } from "http-status-codes";
import commentModel, { IComment } from "../models/commentModel";
import doctorModel from "../models/doctorModel";
import postModel from "../models/postModel";
import createController from "./baseController";

const commentController = createController<IComment>(commentModel);

commentController.create = async (req, res) => {
  const data = req.body;
  try {
    const doctor = await doctorModel.findById(data.doctorId);
    const post = await postModel.findById(data.postId);
    if (!doctor) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid doctorId. Doctor not found." });
      return;
    }
    if (!post) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid postId. Post not found." });
      return;
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return;
  }
  try {
    const object = await commentModel.create(data);
    res.status(StatusCodes.CREATED).json(object);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default commentController;
