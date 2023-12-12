import { Router } from "express";
import { getUsers, getUsersReports, postUser } from "../controllers/userController";

const router = Router();
router.get("/", getUsers);
router.get("/reports", getUsersReports);
router.post("/", postUser);

module.exports = router;
