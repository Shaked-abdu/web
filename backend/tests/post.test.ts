import request from "supertest";
import mongoose from "mongoose";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import { Express } from "express";
import postModel, { IPost } from "../src/models/postModel";
import userModel, { IUser } from "../src/models/userModel";

let app: Express;
const user: IUser = {
  email: "test@doctor.post.com",
  password: "1234567890",
};
let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
  await userModel.deleteMany({ email: user.email });
  user._id = (await request(app).post("/auth/register").send(user)).body._id;
  accessToken = (await request(app).post("/auth/login").send(user)).body
    .accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("post tests", () => {
  const post: IPost = {
    title: "title1",
    content: "message1",
    owner: "1234567890",
  };

  test("Create post", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(post);
    expect(res.status).toBe(StatusCodes.CREATED);
  })
});
