import jwt from 'jsonwebtoken';
import config from '../../core/config.js';
import { AppError } from '../../core/AppError.js';
import authRepository from './auth.repository.js';

/** Service layer — SRP: contains all authentication business logic */
class AuthService {
  generateToken(userId) {
    return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  formatUser(user) {
    return { id: user._id, email: user.email, name: user.name };
  }

  async register({ email, password, name }) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw AppError.conflict('Email already registered');
    }

    const user = await authRepository.create({ email, password, name });
    const token = this.generateToken(user._id);

    return { token, user: this.formatUser(user) };
  }

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    return { token, user: this.formatUser(user) };
  }

  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User');
    }
    return { user };
  }

  async verifyToken(token) {
    const decoded = jwt.verify(token, config.jwt.secret);
    return this.getCurrentUser(decoded.userId);
  }
}

export default new AuthService();
