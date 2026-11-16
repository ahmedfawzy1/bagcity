import express from "express";
import { keepAlive } from "../controllers/keepAlive.controller.js";

const router = express.Router();

router.get("/", keepAlive);

export default router;
