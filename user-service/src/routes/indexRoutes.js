import express from "express";
import authRouter from "./authRotes.js";
const router = express.Router();
router.use('/auth', authRouter);
export default router;
