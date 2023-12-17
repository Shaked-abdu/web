import request from "supertest";
import mongoose from "mongoose";
import initApp from "../src/app";
import doctorModel from "../src/models/doctorModel";
import { StatusCodes } from "http-status-codes";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await doctorModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Doctor tests", () => {
  const doctor = {
    name: "Sharon Levi",
  };

  const dbDoctor = {
    _id: doctor.name,
    name: doctor.name,
  };

  test("Create doctor", async () => {
    const res = await request(app).post("/doctors").send(doctor);
    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body).toMatchObject(dbDoctor);
  });
  test("Get doctor", async () => {
    const res = await request(app).get("/doctors/Sharon Levi");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(dbDoctor);
  });
  test("Get all doctors", async () => {
    const res = await request(app).get("/doctors");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject([dbDoctor]);
  });
  test("Create doctor with invalid id", async () => {
    const res = await request(app).post("/doctors").send({
      name: "Sharon Levi",
      _id: "Sharon Levi",
    });
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  test("get doctor posts", async () => {
    const res = await request(app).get("/doctors/Sharon Levi/posts");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject([]);
  });
  test("Delete doctor", async () => {
    const res = await request(app).delete("/doctors/Sharon Levi");
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toMatchObject(dbDoctor);
  });
  test("update non existing doctor", async () => {
    const res = await request(app).put("/doctors/Sharon Levi").send({
      name: "Sharon Levi",
      _id: "Sharon Levi",
    });
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
});
