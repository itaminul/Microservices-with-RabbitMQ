import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export class authenticateToken {
    async auth(req, res, next) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    };

}
