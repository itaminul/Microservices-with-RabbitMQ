import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthServices } from '../services/authService';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'adfafa@85858558jkjj';

const authService = new AuthServices();
export class authController {
    async create(req, res, next) {
        try {
            // const {email, username, password } = req.body;

            const username = req.body;
            const password = req.body;
            const existingUser = await authService.findUserByUsername(username);
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = {
                email: req.body,
                username: username,
                password: hashedPassword
            }
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const user = await authService.create(data);
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' })
            res.status(201).json({ message: 'User created successfully', token })
        } catch (error) {
            next(error)
        }
    }
}