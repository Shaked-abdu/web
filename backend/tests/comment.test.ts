import initApp from "../src/app";
import request from "supertest";
import mongoose from "mongoose";
import commentModel from "../src/models/commentModel";
import { Express } from "express";
import { StatusCodes } from "http-status-codes";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await commentModel.deleteMany();
  const doctor = {
    name: "Shalom",
  };
  await request(app).post("/doctors").send(doctor);
  const post = {
    title: "title",
    content: "content",
    doctorId: "Shalom",
    _id: "123",
  };
  await request(app).post("/posts").send(post);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comment tests", () => {
  const comment = {
    content: "content",
    postId: "123",
    doctorId: "Shalom",
    _id: "123",
  };
  test("Create comment", async () => {
    const res = await request(app).post("/comments").send(comment);
    expect(res.status).toBe(StatusCodes.CREATED);
  });
  test("Get all comments", async () => {
    const res = await request(app).get("/comments");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject([comment]);
  });
  test("Create comment with invalid id", async () => {
    const res = await request(app).post("/comments").send({
      content: "content",
      postId: "123",
      doctorId: "Shalom",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  test("update comment", async () => {
    const res = await request(app).put("/comments/123").send(comment);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(comment);
  });
  test("Delete comment", async () => {
    const res = await request(app).delete("/comments/123");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(comment);
  });
  test("Create comment with invalid postId", async () => {
    const res = await request(app).post("/comments").send({
      content: "content",
      postId: "1234",
      doctorId: "Shalom",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test("Create comment with invalid doctorId", async () => {
    const res = await request(app).post("/comments").send({
      content: "content",
      postId: "123",
      doctorId: "Shalom2",
      _id: "123",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
