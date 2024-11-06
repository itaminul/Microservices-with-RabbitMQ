import express from 'express'
const authRouter = express.Router();
import { authController } from '../controllers/authController.js';
const authControl = new authController();
authRouter.post('/signup', authControl.create);
authRouter.post('/login', authControl.login);
export default authRouter;