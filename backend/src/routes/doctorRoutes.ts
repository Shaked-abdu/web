import { Router } from "express";
import doctorController from "../controllers/doctorController";

const doctorRouter = Router();
doctorRouter.get("/", doctorController.getAll.bind(doctorController));
doctorRouter.get("/:id", doctorController.getById.bind(doctorController));
doctorRouter.get("/:id/posts", doctorController.getPosts.bind(doctorController));
doctorRouter.post("/", doctorController.create.bind(doctorController));
doctorRouter.delete("/:id", doctorController.deleteById.bind(doctorController));

export = doctorRouter;
