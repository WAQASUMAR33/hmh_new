import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';

export const generateVerificationToken = (userId) =>
    jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' }); // Increased to 24 hours

export const verifyJwt = (token) => jwt.verify(token, JWT_SECRET);

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
