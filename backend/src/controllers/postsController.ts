import { StatusCodes } from "http-status-codes";
import postModel, { IPost } from "../models/postModel";
import createController from "./baseController";
import DoctorModel from "../models/doctorModel";
import commentModel from "../models/commentModel";

const postController = createController<IPost>(postModel);

postController.create = async (req, res) => {
  const data = req.body;

  try {
    const doctor = await DoctorModel.findById(data.doctorId);
    if (!doctor) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid doctorId. Doctor not found." });
      return;
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return;
  }

  try {
    const object = await postModel.create(data);
    res.status(StatusCodes.CREATED).json(object);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

postController.updateById = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.body.doctorId);
    if (!doctor) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid doctorId. Doctor not found." });
      return;
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return;
  }
  try {
    const object = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!object) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    }
    res.send(object);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

postController.getComments = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Invalid postId. Post not found." });
      return;
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return;
  }
  try {
    const comments = await commentModel.find({ postId: req.params.id });
    res.send(comments);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default postController;
