import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import postModel, { IPost } from "../models/postModel";
import { BaseConstroller } from "./baseController";
import { Model } from "mongoose";
import { AuthRequest } from "../common/authMiddleware";

class PostController extends BaseConstroller<IPost> {
  constructor(model: Model<IPost>) {
    super(model);
  }

  async post(req: AuthRequest, res: Response) {
    const _id = req.user._id;
    req.body.owner = _id;
    super.post(req, res);
  }

  async deleteById(req: AuthRequest, res: Response) {
    console.log("delete post");
    const _id = req.user._id;
    console.log(`_id: ${_id}`);
    console.log(`req.body.owner: ${req.body.owner}`);
    if (_id != req.body.owner) {
      res.status(StatusCodes.UNAUTHORIZED).send();
    }
    super.deleteById(req, res);
  }

  async getByUserId(req: AuthRequest, res: Response) {
    try {
      const result = await this.model.find({ owner: req.params.id });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR) 
    }
  }
}

export default new PostController(postModel);

// const postController = createController<IPost>(postModel);

// postController.create = async (req, res) => {
//   const data = req.body;

//   try {
//     const doctor = await DoctorModel.findById(data.doctorId);
//     if (!doctor) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Invalid doctorId. Doctor not found." });
//       return;
//     }
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
//     return;
//   }

//   try {
//     const object = await postModel.create(data);
//     res.status(StatusCodes.CREATED).json(object);
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
//   }
// };

// postController.updateById = async (req, res) => {
//   try {
//     const doctor = await DoctorModel.findById(req.body.doctorId);
//     if (!doctor) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Invalid doctorId. Doctor not found." });
//       return;
//     }
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
//     return;
//   }
//   try {
//     const object = await postModel.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!object) {
//       res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
//     }
//     res.send(object);
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
//   }
// };

// postController.getComments = async (req, res) => {
//   try {
//     const post = await postModel.findById(req.params.id);
//     if (!post) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Invalid postId. Post not found." });
//       return;
//     }
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
//     return;
//   }
//   try {
//     const comments = await commentModel.find({ postId: req.params.id });
//     res.send(comments);
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
//   }
// };

// export default postController;
