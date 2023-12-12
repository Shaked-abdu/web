import { User, reports, UserDocument } from "./../models/userModel";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUsersReports = async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    let reports: Array<reports> = [];
    users.forEach((user: UserDocument) => {
      reports = [...reports, ...user.reports];
    });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const postUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Create a new user using the User model
    const newUser = new User({
      name,
      reports: [],
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
