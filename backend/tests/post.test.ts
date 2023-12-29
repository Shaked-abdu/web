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
  });
  // test("Get post", async () => {
  //   const res = await request(app).get("/posts/123");
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toMatchObject(post);
  // });
  // test("Update post", async () => {
  //   const res = await request(app)
  //     .put("/posts/123")
  //     .send({
  //       title: "title",
  //       content: "content",
  //       doctorId: "Shalom",
  //       _id: "123",
  //     })
  //     .set("Authorization", `Bearer ${accessToken}`);
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toMatchObject(post);
  // });
  // test("get post comments", async () => {
  //   const res = await request(app).get("/posts/123/comments");
  //   expect(res.status).toBe(StatusCodes.OK);
  //   expect(res.body).toMatchObject([]);
  // });
  // test("update post with invalid doctorId", async () => {
  //   const res = await request(app)
  //     .put("/posts/123")
  //     .send({
  //       title: "title",
  //       content: "content",
  //       doctorId: "Shalom2",
  //       _id: "123",
  //     })
  //     .set("Authorization", `Bearer ${accessToken}`);
  //   expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  // });
  // test("Create post with non existing doctorId", async () => {
  //   const res = await request(app)
  //     .post("/posts")
  //     .send({
  //       title: "title",
  //       content: "content",
  //       doctorId: "Shalom2",
  //       _id: "123",
  //     })
  //     .set("Authorization", `Bearer ${accessToken}`);
  //   expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  // });
  // test("Get post comments of non existing post", async () => {
  //   const res = await request(app).get("/posts/1234/comments");
  //   expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  // });
});
