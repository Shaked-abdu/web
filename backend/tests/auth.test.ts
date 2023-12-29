// import request from "supertest";
// import { Express } from "express";
// import mongoose from "mongoose";
// import initApp from "../src/app";
// import userModel from "../src/models/userModel";
// import { StatusCodes } from "http-status-codes";

// let app: Express;
// const user = {
//   email: "testUser@test.com",
//   password: "1234567890",
// };

beforeAll(async () => {
  //   app = await initApp();
  console.log("beforeAll");
//   await userModel.deleteMany({ email: user.email });
});

afterAll(async () => {
//   await mongoose.connection.close();
});

// let accessToken: string;
// let refreshToken: string;

describe("Auth tests", () => {
  test("Init test", () => {
    expect(1).toBe(1);
  });

  //   test("Test Register", async () => {
  //     const response = await request(app).post("/auth/register").send(user);
  //     expect(response.statusCode).toBe(201);
  //   });
  //   test("Register with existing email", async () => {
  //     const response = await request(app).post("/auth/register").send(user);
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test Register missing password", async () => {
  //     const response = await request(app).post("/auth/register").send({
  //       email: "test@test.com",
  //     });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Login test", async () => {
  //     const response = await request(app).post("/auth/login").send(user);
  //     expect(response.statusCode).toBe(StatusCodes.OK);
  //     accessToken = response.body.accessToken;
  //     expect(accessToken).not.toBeNull();
  //     refreshToken = response.body.refreshToken;
  //     expect(refreshToken).not.toBeNull();

  //     const response2 = await request(app)
  //       .get("/doctors")
  //       .set("Authorization", `Bearer ${accessToken}`);
  //     expect(response2.statusCode).toBe(StatusCodes.OK);
  //     // const response3 = await request(app)
  //     //   .get("/doctors")
  //     //   .set("Authorization", `Bearer 1 ${accessToken}`);
  //     // expect(response3.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  //   });

  //   test("token timeout", async () => {
  //     jest.setTimeout(10000);
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     const response = await request(app)
  //       .get("/doctors")
  //       .set("Authorization", `Bearer ${accessToken}`);
  //     expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);

  //     const request2 = await request(app)
  //       .get("/auth/refreshToken")
  //       .set("Authorization", `Bearer ${refreshToken}`)
  //       .send();
  //     expect(request2.statusCode).toBe(StatusCodes.OK);
  //     accessToken = request2.body.accessToken;
  //     expect(accessToken).not.toBeNull();
  //     refreshToken = request2.body.refreshToken;
  //     expect(refreshToken).not.toBeNull();

  //     const request3 = await request(app)
  //       .get("/doctors")
  //       .set("Authorization", `Bearer ${refreshToken}`)
  //       .send();
  //     expect(request3.statusCode).toBe(StatusCodes.OK);
  //   });

  //   test("logout timeout", async () => {
  //     const response = await request(app)
  //     .get("/auth/logout")
  //     .set("Authorization", `Bearer ${accessToken}`)
  //     .send();
  //     expect(response.statusCode).toBe(StatusCodes.OK);
  //     // const request2 = await request(app)
  //     //   .get("/doctors")
  //     //   .set("Authorization", `Bearer ${refreshToken}`)
  //     //   .send();
  //   });
});
