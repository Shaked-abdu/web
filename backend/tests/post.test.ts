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
  password: "1234567890123",
  firstName: "firstName",
  lastName: "lastName",
  age: 20,
  profession: "profession",
  phoneNumber: "phoneNumber",
  id: "3164451351",
};
const user2: IUser = {
  email: "test@test123",
  password: "123456789fgfg0",
  firstName: "firstName",
  lastName: "lastName",
  age: 20,
  profession: "profession",
  phoneNumber: "phoneNumber",
  id: "3164451352",
};
let accessToken: string;
let accessToken2: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
  await userModel.deleteMany({ email: user.email });
  await userModel.deleteMany({ email: user2.email });
  user._id = (await request(app).post("/auth/register").send(user)).body._id;
  accessToken = (await request(app).post("/auth/login").send(user)).body
    .accessToken;
  user2._id = (await request(app).post("/auth/register").send(user2)).body._id;
  accessToken2 = (await request(app).post("/auth/login").send(user2)).body
    .accessToken;
});

afterAll(async () => {
  await userModel.deleteMany({ email: user.email });
  await userModel.deleteMany({ email: user2.email });
  await mongoose.connection.close();
});

describe("post tests", () => {
  const post: IPost = {
    title: "title1",
    content: "message1",
  };

  let postId: string;

  test("Create post", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(post);
    postId = res.body._id;
    expect(res.status).toBe(StatusCodes.CREATED);
  });
  test("Get post", async () => {
    const res = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.length).toBe(1);
  });
  test("Get post by id", async () => {
    const res = await request(app)
      .get(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.title).toBe(post.title);
    expect(res.body.content).toBe(post.content);
  });
  test("Update post", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "title2", content2: "content2" });
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.title).toBe("title2");
  });
  test("Update non existing post", async () => {
    const res = await request(app)
    .put(`/posts/${postId.split("").reverse().join("")}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ title: "title2", content2: "content2" });
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Delete post of another user", async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken2}`);
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  });
  test("Delete by id", async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
  });
  test("Delete non existing post", async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Get posts by user id", async () => {
    const res = await request(app)
      .get(`/posts/user/${user._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.length).toBe(0);
  });
  test("Get by id non existing post", async () => {
    const res = await request(app)
      .get(`/posts/${postId.split("").reverse().join("")}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
});
