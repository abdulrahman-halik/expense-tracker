import { Request, Response, NextFunction } from 'express';

/**
 * AppError – an operational error with a known HTTP status code.
 * Use this to signal expected errors (e.g., "not found", "forbidden")
 * that should be reported to the client with a clean message.
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Maintains a proper stack trace in V8
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Centralised Express error-handling middleware.
 * Must be registered AFTER all routes in index.ts.
 * Express 5 automatically passes async errors here via next(err).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Default status and message
    let statusCode = 500;
    let message = 'Internal server error';

    // Operational errors (created by AppError) – safe to send as-is
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Mongoose CastError (invalid ObjectId)
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    // Mongoose duplicate key error
    else if ((err as NodeJS.ErrnoException).code === '11000') {
        statusCode = 409;
        message = 'Duplicate field value – resource already exists';
    }

    // JSON Web Token errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    // Log stack in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('[Error]', err.stack ?? err.message);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};
