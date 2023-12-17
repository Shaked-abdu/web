import request from "supertest";
import mongoose from "mongoose";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import { Express } from "express";
import postModel, { IPost } from "../src/models/postModel";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
  const doctor = {
    name: "Shalom",
  };
  await request(app).post("/doctors").send(doctor);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("post tests", () => {
  const post: IPost = {
    title: "title",
    content: "content",
    doctorId: "Shalom",
    _id: "123",
  };

  test("Create post", async () => {
    const res = await request(app).post("/posts").send(post);
    expect(res.status).toBe(StatusCodes.CREATED);
  });
  test("Get post", async () => {
    const res = await request(app).get("/posts/123");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(post);
  });
  test("Update post", async () => {
    const res = await request(app).put("/posts/123").send({
      title: "title",
      content: "content",
      doctorId: "Shalom",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(post);
  });
  test("get post comments", async () => {
    const res = await request(app).get("/posts/123/comments");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject([]);
  });
  test("update post with invalid doctorId", async () => {
    const res = await request(app).put("/posts/123").send({
      title: "title",
      content: "content",
      doctorId: "Shalom2",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test("Create post with non existing doctorId", async () => {
    const res = await request(app).post("/posts").send({
      title: "title",
      content: "content",
      doctorId: "Shalom2",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test("Get post comments of non existing post", async () => {
    const res = await request(app).get("/posts/1234/comments");
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
