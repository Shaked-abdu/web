import { AuthRequest } from "./../common/authMiddleware";
import { StatusCodes } from "http-status-codes";
import commentModel, { IComment } from "../models/commentModel";
import postModel from "../models/postModel";
import { Response } from "express";
import { BaseConstroller } from "./baseController";
import { Model } from "mongoose";

class CommentController extends BaseConstroller<IComment> {
  constructor(model: Model<IComment>) {
    super(model);
  }

  async post(req: AuthRequest, res: Response) {
    try {
      const post = await postModel.findById(req.body.postId);
      if (post == null) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send("Invalid postId. Post not found.");
      }
      const _id = req.user._id;
      req.body.owner = _id;
      super.post(req, res);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    const _id = req.user._id;
    try {
      const comment = await commentModel.findById(req.params.id);
      if (comment == null) {
        res.status(StatusCodes.BAD_REQUEST).send("Comment not found");
      }
      if (comment.owner != _id) {
        res.status(StatusCodes.UNAUTHORIZED).send();
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    super.deleteById(req, res);
  }

  async getByPostId(req: AuthRequest, res: Response) {
    try {
      const result = await this.model.find({ postId: req.params.id });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new CommentController(commentModel);
