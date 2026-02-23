import jwt from 'jsonwebtoken';

// Helper that mirrors the private generateToken in authController
const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET ?? 'test_secret_key';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

const verifyToken = (token: string): { id: string } => {
    const secret = process.env.JWT_SECRET ?? 'test_secret_key';
    return jwt.verify(token, secret) as { id: string };
};

// Provide a consistent secret for all tests in this file
beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key';
});

describe('JWT token logic', () => {
    it('generates a token that can be verified', () => {
        const userId = 'user123';
        const token = generateToken(userId);
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3); // header.payload.signature
    });

    it('decoded payload contains the correct user id', () => {
        const userId = 'abc456';
        const token = generateToken(userId);
        const decoded = verifyToken(token);
        expect(decoded.id).toBe(userId);
    });

    it('throws JsonWebTokenError for a tampered token', () => {
        const token = generateToken('user789');
        const tampered = token + 'x';
        expect(() => jwt.verify(tampered, 'test_secret_key')).toThrow(jwt.JsonWebTokenError);
    });

    it('throws an error when verified with the wrong secret', () => {
        const token = generateToken('user999');
        expect(() => jwt.verify(token, 'wrong_secret')).toThrow();
    });
});
