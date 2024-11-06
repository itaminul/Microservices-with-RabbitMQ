import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthServices } from '../services/authService.js';
import { responseHelper } from '../utils/responseHelper.js';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'adfafa@85858558jkjj';
const sendResponseHelper = new responseHelper();
const authService = new AuthServices();
export class authController {

    async create(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const existingUser = await authService.findUserByUsername(username);
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                createdBy: req.body.createdBy
            };
            if (existingUser) {
                return sendResponseHelper.sendError(res, 400, 'User already exists');
            }
            await authService.create(data);
            return sendResponseHelper.sendSuccess(res, 201, 'User created successfully');

        } catch (error) {
            return sendResponseHelper.sendError(res, 500, 'Internal server error', { error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await authService.findUserByUsername(username)
            if (!user) {
                return res.status(400).json({ "success": false, message: 'Invalid user name' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ "success": false, message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' })

            return sendResponseHelper.sendSuccess(res, 201, 'Login successfully', token);
        } catch (error) {
            return sendResponseHelper.sendError(res, 500, 'Internal server error', { error: error.message });
        }


    }
}