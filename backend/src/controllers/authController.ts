import { StatusCodes } from "http-status-codes";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
const logout = async (req, res) => {
  console.log("logout");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
  console.log(`token: ${token}`);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN);
    }
    const userId = userInfo._id;
    console.log(`userInfo: ${userInfo}`);
    try {
      const user = await userModel.findById(userId);
      if (user == null) {
        res.status(StatusCodes.FORBIDDEN);
      }
      console.log(`user: ${user}`);
      if (!user.tokens.includes(token)) {
        console.log(`Token ${token} not found`);
        console.log(`user.tokens: ${user.tokens}`);
        user.tokens = [];
        await user.save();
        console.log(`After save`);
        return res.status(StatusCodes.FORBIDDEN);
      }
      console.log(`After token check`);
      user.tokens.splice(user.tokens.indexOf(token), 1);
      console.log(`After splice`);
      await user.save();
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN);
    }
  });
};

const refresh = async (req, res) => {
  console.log("refresh");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(StatusCodes.UNAUTHORIZED);
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN);
    }
    const userId = userInfo._id;
    try {
      const user = await userModel.findById(userId);
      if (user == null) {
        res.status(StatusCodes.FORBIDDEN);
      }
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        return res.status(StatusCodes.FORBIDDEN);
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
      res.status(StatusCodes.FORBIDDEN);
    }
  });
};

export default { login, register, logout, refresh };
