import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    res.status(StatusCodes.BAD_REQUEST).send("Email or password is empty");
    return;
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (user == null) {
      res.status(StatusCodes.BAD_REQUEST).send("Bad email or password");
      return;
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(StatusCodes.BAD_REQUEST).send("Bad email or password");
      return;
    }

    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
    res.status(StatusCodes.OK).send({ accessToken: accessToken });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const register = async (req, res) => {
  console.log("register");

  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    res.status(StatusCodes.BAD_REQUEST).send("Email or password is empty");
    return;
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (user != null) {
      res.status(StatusCodes.BAD_REQUEST).send("Email already exists");
      return;
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const user = new userModel({
      email: email,
      password: hash,
    });
    const newUser = await user.save();
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    return;
  }
};

const logout = async (req, res) => {
  console.log("logout");
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Not implemented");
};

export = { login, register, logout };
