import initApp from "../src/app";
import request from "supertest";
import mongoose from "mongoose";
import commentModel, { IComment } from "../src/models/commentModel";
import { Express } from "express";
import postModel, { IPost } from "../src/models/postModel";
import userModel, { IUser } from "../src/models/userModel";
import { StatusCodes } from "http-status-codes";

let app: Express;
const user: IUser = {
  email: "mail",
  password: "1234567890",
  firstName: "firstName",
  lastName: "lastName",
  age: 20,
  profession: "profession",
  phoneNumber: "phoneNumber",
  id: "3164451351",
};
const user2: IUser = {
  email: "mail2",
  password: "1234567890",
  firstName: "firstName2",
  lastName: "lastName2",
  age: 20,
  profession: "profession2",
  phoneNumber: "phoneNumber2",
  id: "3164451352",
};
const post: IPost = {
  title: "title1",
  content: "message1",
};

let accessToken: string;
let accessToken2: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await commentModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany({ email: user.email });
  await userModel.deleteMany({ email: user2.email });
  user._id = (await request(app).post("/auth/register").send(user)).body._id;
  accessToken = (await request(app).post("/auth/login").send(user)).body
    .accessToken;
  user2._id = (await request(app).post("/auth/register").send(user2)).body._id;
  accessToken2 = (await request(app).post("/auth/login").send(user2)).body
    .accessToken;
  post._id = (
    await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(post)
  ).body._id;
});

afterAll(async () => {
  await userModel.deleteMany({ email: user.email });
  await userModel.deleteMany({ email: user2.email });
  await commentModel.deleteMany();
  await mongoose.connection.close();
});

describe("Comment tests", () => {
  let comment: IComment = {
    content: "comment 1",
    postId: "",
  };

  test("Create comment", async () => {
    comment.postId = post._id;
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(comment);
    comment = res.body;
    expect(res.status).toBe(StatusCodes.CREATED);
  });

  test("Delete comment of another user", async () => {
    const res2 = await request(app)
      .delete(`/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken2}`);
    expect(res2.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("Delete comment", async () => {
    const res = await request(app)
      .delete(`/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
  });

  test("Get comments by post id", async () => {
    const res = await request(app)
      .get(`/comments/post/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.length).toBe(0);
  });
  test("Delete non existing comment", async () => {
    const res = await request(app)
      .delete(`/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Create comment with non existing post", async () => {
    comment.postId = comment.postId.split("").reverse().join("");
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(comment);
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
