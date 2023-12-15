import { StatusCodes } from "http-status-codes";
import DoctorModel, { IDoctor } from "../models/doctorModel";
import createController from "./baseController";
import postModel from "../models/postModel";

const doctorController = createController<IDoctor>(DoctorModel);

doctorController.create = async (req, res) => {
  const data = req.body;
  data["_id"] = data.name;

  try {
    const result = await DoctorModel.create(data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

doctorController.getPosts = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
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
    const posts = await postModel.find({ doctorId: req.params.id });
    res.send(posts);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export default doctorController;
