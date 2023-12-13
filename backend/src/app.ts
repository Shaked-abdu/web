import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute";

const initApp = () => {
  const promise = new Promise((resolve, reject) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error: any) =>
      console.error(`Failed to establish Database connection: ${error}`)
    );
    mongoose.connect(process.env.DB_URL as string).then(() => {
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use("/users", userRouter);
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
