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
    try {
      const post = await postModel.findById(req.params.id);
      if (post == null) {
        res.status(StatusCodes.NOT_FOUND).send("Post not found");
      }
      if (post.owner != _id) {
        res.status(StatusCodes.UNAUTHORIZED).send();
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    super.deleteById(req, res);
  }

  async getByUserId(req: AuthRequest, res: Response) {
    try {
      const result = await this.model.find({ owner: req.params.id });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new PostController(postModel);
