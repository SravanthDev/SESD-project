import jwt from 'jsonwebtoken';
import config from '../core/config.js';
import { AppError } from '../core/AppError.js';

/** JWT auth middleware — SRP: only handles token verification and userId extraction */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw AppError.unauthorized('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.isOperational) {
      return next(error);
    }
    next(AppError.unauthorized('Invalid or expired token'));
  }
};
