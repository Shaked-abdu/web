import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import doctorRouter from "./routes/doctorRoutes";
import postRouter from "./routes/postRutes";
import commentRouter from "./routes/commentRutes";

const app = express();

const initApp = () => {
  const db = mongoose.connection;
  db.on("error", (error) =>
    console.error(`Failed to establish Database connection: ${error}`)
  );
  db.once("open", () => {
    console.log("Connected to Database");
  });

  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/doctors", doctorRouter);
        app.use("/posts", postRouter);
        app.use("/comments", commentRouter)
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;
