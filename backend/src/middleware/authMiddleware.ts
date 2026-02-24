import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService';

// Extend the Express Request type to carry user context
export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

interface JwtPayload {
    id: string;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorised – no token provided' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ success: false, message: 'Server configuration error' });
        return;
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, secret) as JwtPayload;
    } catch {
        res.status(401).json({ success: false, message: 'Not authorised – token is invalid or expired' });
        return;
    }

    // Attach user to request (password excluded by findUserById)
    const user = await findUserById(decoded.id);
    if (!user) {
        res.status(401).json({ success: false, message: 'Not authorised – user no longer exists' });
        return;
    }

    req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
    };

    next();
};
