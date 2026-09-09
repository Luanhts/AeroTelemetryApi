import express from "express";
import userController from "../../controllers/userController.js";
import app from "../../app.js";

const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

export default router;