import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const validateUser = (user) => {
  if (
    !user.email == null ||
    user.password == null ||
    user.firstName == null ||
    user.lastName == null ||
    user.age == null ||
    user.profession == null ||
    user.phoneNumber == null ||
    user.id == null
  ) {
    return false;
  }

  return true;
};
const register = async (req, res) => {
  console.log("register");

  if (!validateUser(req.body)) {
    res.status(StatusCodes.BAD_REQUEST).send("Bad user data");
    return;
  }

  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user != null) {
      res.status(StatusCodes.BAD_REQUEST).send("Email already exists");
      return;
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new userModel({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      profession: req.body.profession,
      phoneNumber: req.body.phoneNumber,
      id: req.body.id,
    });
    console.log("before save");
    const newUser = await user.save();
    console.log("after save");
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    return;
  }
};
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

    const refreshToken = await jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    if (user.tokens == null) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }
    await user.save();
    res
      .status(StatusCodes.OK)
      .send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
const logout = async (req, res) => {
  console.log("logout");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN).send();
    }
    const userId = userInfo._id;
    try {
      const user = await userModel.findById(userId);
      if (user == null) {
        res.status(StatusCodes.FORBIDDEN).send();
      }
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        return res.status(StatusCodes.FORBIDDEN).send();
      }
      user.tokens.splice(user.tokens.indexOf(token), 1);
      await user.save();
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).send();
    }
  });
};

const refresh = async (req, res) => {
  console.log("refresh");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN).send();
    }
    const userId = userInfo._id;
    try {
      const user = await userModel.findById(userId);
      if (user == null) {
        res.status(StatusCodes.FORBIDDEN).send();
      }
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        return res.status(StatusCodes.FORBIDDEN).send();
      }
      const newAccessToken = await jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );

      const newRefreshToken = await jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      user.tokens[user.tokens.indexOf(token)] = newRefreshToken;

      await user.save();
      res
        .status(StatusCodes.OK)
        .send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).send();
    }
  });
};

export default { login, register, logout, refresh };
