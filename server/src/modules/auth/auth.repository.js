import User from './auth.model.js';

/** Repository layer — SRP: only handles data access for users */
class AuthRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id).select('-password');
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }
}

export default new AuthRepository();
