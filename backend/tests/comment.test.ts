import initApp from "../src/app";
import request from "supertest";
import mongoose from "mongoose";
import commentModel from "../src/models/commentModel";
import { Express } from "express";
// import { StatusCodes } from "http-status-codes";

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
  test("init test", () => {
    expect(1).toBe(1);
  });
});
