
import request from "supertest";
import { Express } from "express";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

let app: Express;
beforeAll(async () => {
    app = await initApp();
})

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Image tests", () => {
  test("Upload image", async () => {
    const res = await request(app)
      .post("/images/uploads/123")
      .attach("image", "images/test.png");
    expect(res.status).toBe(StatusCodes.CREATED);
  });
  test("Get image", async () => {
    const res = await request(app).get("/images/123");
    expect(res.status).toBe(StatusCodes.OK);
  });
  test("Get image that does not exist", async () => {
    const res = await request(app).get("/images/456");
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
  test("Upload image without image", async () => {
    const res = await request(app).post("/images/uploads/123");
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
 
});
