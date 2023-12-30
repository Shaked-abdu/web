import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRouter from "./routes/postRutes";
import commentRouter from "./routes/commentRoutes";
import authRouter from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();

const initApp = () => {
  const db = mongoose.connection;
  db.on("error", (error) =>
    console.error(`Failed to establish Database connection: ${error}`)
  );
  db.once("open", () => {
    console.log("Connected to Database");
  });

  if (process.env.NODE_ENV === "development") {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "API",
          description: "API Information",
          version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000" }],
      },
      apis: ["./src/routes/*.ts", "./src/models/*.ts"],
    };
    const specs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/posts", postRouter);
        app.use("/comments", commentRouter);
        app.use("/auth", authRouter);
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;
