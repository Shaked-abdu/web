import "dotenv/config";
import session from "express-session";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRouter from "./routes/postRutes";
import commentRouter from "./routes/commentRoutes";
import authRouter from "./routes/authRoutes";
import imageRouter from "./routes/imageRouter";
import userRouter from "./routes/userRoutes";
import passport from "passport";
import googleRouter from "./routes/googleRoutes";
import cors from "cors";
import MemoryStore from "memorystore";

const app = express();

const initApp = () => {

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 60000},
      store: new (MemoryStore(session))({ checkPeriod: 86400000 }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

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
        app.use("/users", userRouter);
        app.use("/posts", postRouter);
        app.use("/comments", commentRouter);
        app.use("/auth", authRouter);
        app.use("/auth", googleRouter)
        app.use("/images", imageRouter);
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;