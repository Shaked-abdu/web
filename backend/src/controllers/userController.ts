import UserModel, { IUser } from "../models/userModel";
import createController from "./baseController";

const userController = createController<IUser>(UserModel);

export default userController;