import express from 'express'
const authRouter = express.Router();
import { authController } from '../controllers/authController.js';
const authControl = new authController();
authRouter.post('/signup', authControl.create);
export default authRouter;