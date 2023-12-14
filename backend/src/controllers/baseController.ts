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
  
  async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const result = await this.model.create(data);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
}

const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseConstroller<ModelType>(model);
};

export default createController;
