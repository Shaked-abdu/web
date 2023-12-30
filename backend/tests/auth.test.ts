import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import userModel from "../src/models/userModel";

let app: Express;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
};

let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await userModel.deleteMany({ email: user.email });
});

afterAll(async () => {
  await userModel.deleteMany({ email: user.email });
  await mongoose.connection.close();
});

describe("Register", () => {
  test("Access without auth", async () => {
    const response = await request(app).post("/posts");
    expect(response.status).not.toBe(StatusCodes.OK);
  });

  test("Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  test("Register with existing email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test("Empty email", async () => {
    const response = await request(app).post("/auth/register").send({
      password: "1234567890",
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe("Login", () => {
  test("Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.status).toBe(StatusCodes.OK);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  });

  test("Empty email", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "1234567890",
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test("Wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "123456789",
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
  test("Wrong email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "non@exists",
    });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe("Refresh", () => {
  test("Refresh", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", `Bearer ${refreshToken}`);
    expect(response.status).toBe(StatusCodes.OK);
    accessToken = response.body.accessToken;
    expect(accessToken).not.toBeNull();
  });
});

describe("Logout", () => {
  test("Logout", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", `Bearer ${refreshToken}`);
    expect(response.status).toBe(StatusCodes.OK);
  });
});
