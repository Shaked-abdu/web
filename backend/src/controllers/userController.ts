import { Response } from "express";
import { AuthRequest } from "../common/authMiddleware";
import userModel, { IUser } from "../models/userModel";
import { BaseConstroller } from "./baseController";
import { Model } from "mongoose";
import { StatusCodes } from "http-status-codes";

class UserController extends BaseConstroller<IUser> {
  constructor(model: Model<IUser>) {
    super(model);
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const dbUser = await userModel.findById(req.params.id);
      if (!dbUser) {
        res.status(404).send("User not found");
      }
      const user = {
        email: dbUser.email,
        age: dbUser.age,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profession: dbUser.profession,
        phoneNumber: dbUser.phoneNumber,
        id: dbUser.id,
      };
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const dbUser = await userModel.findById(req.params.id);
      if (!dbUser) {
        res.status(404).send();
      }
      dbUser.email = req.body.email;
      dbUser.age = req.body.age;
      dbUser.firstName = req.body.firstName;
      dbUser.lastName = req.body.lastName;
      dbUser.profession = req.body.profession;
      dbUser.phoneNumber = req.body.phoneNumber;
      dbUser.id = req.body.id;
      await dbUser.save();
      res.status(StatusCodes.OK).send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
}

export default new UserController(userModel);
