import request from "supertest";
import { Express } from "express";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

let app: Express;
beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Google tests", () => {
  it("should redirect to Google login page", async () => {
    const response = await request(app).get("/auth/google-login");
    expect(response.status).not.toBe(StatusCodes.OK);
  });
});
