import { Model } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

class BaseConstroller<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.model.find();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const object = await this.model.findById(req.params.id);
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
      }
      res.send(object);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const result = await this.model.create(data);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const object = await this.model.findByIdAndDelete(req.params.id);
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
      }
      res.send(object);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateById(req: Request, res: Response) {
    try {
      const object = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
      }
      res.send(object);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseConstroller<ModelType>(model);
};

export default createController;
