import request from "supertest";
import mongoose from "mongoose";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import { Express } from "express";
import userModel, { IUser } from "../src/models/userModel";

let app: Express;

const user: IUser = {
  email: "test@doctor.post.com",
  password: "1234567890123",
  firstName: "firstName",
  lastName: "lastName",
  age: 20,
  profession: "profession",
  phoneNumber: "phoneNumber",
  id: "3164451351",
};

let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany({ email: user.email });
  user._id = (await request(app).post("/auth/register").send(user)).body;
  accessToken = (await request(app).post("/auth/login").send(user)).body
    .accessToken;
  console.log("beforeAll" + user._id);
});

afterAll(async () => {
  await userModel.deleteMany({ email: user.email });
  await userModel.deleteMany({ email: "shakedabdu@gmail.com" });
  await mongoose.connection.close();
});

describe("user tests", () => {
  test("Get by id", async () => {
    const response = await request(app)
      .get(`/users/${user._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(StatusCodes.OK);
  });
  test("Get by id - not found", async () => {
    const response = await request(app)
      .get(`/users/${user._id.split("").reverse().join("")}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Get user by email", async () => {
    const response = await request(app)
      .get(`/users/email/${user.email}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(StatusCodes.OK);
  });
  test("Get user by email - not found", async () => {
    const response = await request(app)
      .get(`/users/email/${user.email}1`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Update user", async () => {
    const newUser: IUser = {
      age: 232,
      email: "shakedabdu@gmail.com",
      firstName: "שקד",
      id: "207965989",
      lastName: "עבדו",
      phoneNumber: "0526371870",
      profession: "מתכנת",
    };
    const response = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newUser);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test("Update user - not found", async () => {
    const response = await request(app)
      .put(`/users/${user._id.split("").reverse().join("")}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(user);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
